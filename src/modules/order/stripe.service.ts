import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomException } from 'src/exceptions/custom.exception';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2025-02-24.acacia',
      },
    );
  }

  async createCheckoutSession(
    userId: string,
    products: any[],
    totalPrice: number,
    origin: string,
  ) {
    const successUrl = `${origin}/${this.configService.get<string>('SUCCESS')}`;
    const cancelUrl = `${origin}/${this.configService.get<string>('CANCEL')}`;
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.item.title,
          },
          unit_amount: Math.round(product.item.price * 100),
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        totalPrice: totalPrice.toFixed(),
        products: JSON.stringify(products),
      },
    });

    return session.url;
  }

  async handleWebhook(body: any, sig: any) {
    try {
      const event = await this.stripe.webhooks.constructEvent(
        body,
        sig,
        this.configService.get('WEBHOOK'),
      );
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any as Stripe.Checkout.Session;
        const userId = session.metadata.userId;
        const totalPrice = session.metadata.totalPrice;
        const products = JSON.parse(session.metadata.products);
        // Return the necessary data to create an order
        return { userId, totalPrice, products };
      }
    } catch (err) {
      throw new CustomException(`Webhook Error: ${err.message}`, 400);
    }
  }

  constructEvent(payload: Buffer, sig: string, secret: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, sig, secret);
  }
}
