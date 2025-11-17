import type { VercelRequest, VercelResponse } from '@vercel/node';
import Pusher from 'pusher';
import { LocationData } from '../src/types';

// Initialize Pusher with server-side credentials from Vercel Environment Variables
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true
});

interface TriggerRequestBody {
    id: string;
    location: LocationData;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  try {
    const { id: trackingId, location } = request.body as TriggerRequestBody;

    if (!trackingId || !location) {
      return response.status(400).json({ error: 'Tracking ID and location are required' });
    }

    // Sanitize trackingId to prevent abuse
    const sanitizedId = trackingId.replace(/[^a-zA-Z0-9-]/g, '');
     if (sanitizedId.length < 10) {
        return response.status(400).json({ error: 'Invalid Tracking ID format' });
    }

    const channelName = `location-${sanitizedId}`;
    const eventName = 'location-update';

    // Trigger an event to Pusher Channels
    await pusher.trigger(channelName, eventName, location);

    return response.status(200).json({ success: true });

  } catch (error) {
    console.error('PUSHER_TRIGGER_ERROR:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
    return response.status(500).json({ error: 'Failed to trigger event', details: errorMessage });
  }
}