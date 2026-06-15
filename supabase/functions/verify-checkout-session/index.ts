import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' })

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authenticate user
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { sessionId } = await req.json()
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'Session ID requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Retrieve the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    })

    // Verify this session belongs to the authenticated user
    if (session.metadata?.supabase_user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Session non autorisée' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: 'Paiement non complété', status: session.payment_status }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const subscription = session.subscription as Stripe.Subscription
    const type = session.metadata?.type || 'premium_alerts'

    // Upsert subscription record
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: session.customer as string,
      type,
      status: 'active',
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      price_amount: 750,
      price_currency: 'eur',
      price_interval: 'month',
    }, { onConflict: 'stripe_subscription_id' })

    // Activate premium_alerts on user profile
    await supabaseAdmin
      .from('profiles')
      .update({ premium_alerts: true })
      .eq('id', user.id)

    return new Response(JSON.stringify({
      success: true,
      subscription: {
        id: subscription.id,
        status: 'active',
        type,
      },
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Verify session error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
