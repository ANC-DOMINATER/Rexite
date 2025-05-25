# Vapi Integration Setup

This project uses Vapi AI for real-time voice conversations in the interview feature.

## Configuration

To set up Vapi integration, you need to create a `.env.local` file in the root of your project with the following variables:

```
# Vapi Integration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

## Getting Your Vapi Credentials

1. Sign up or log in to [Vapi](https://vapi.ai)
2. Create a new API key in your Vapi dashboard (make sure to use your **public key**)
3. Create a new assistant or use an existing one
4. Copy the assistant ID
5. Add both the API key and assistant ID to your `.env.local` file

## SDK Integration Details

The current implementation uses the Vapi Web SDK (version 2.3.1+) which has the following features:

- Real-time voice conversations with AI
- Audio level visualization
- Call state management (start, end, speaking, listening)
- Event-based architecture

The main integration points are:

```javascript
// Initialize Vapi
const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY)

// Set up event listeners
vapi.on('call-start', () => { /* ... */ })
vapi.on('call-end', () => { /* ... */ })
vapi.on('speech-start', () => { /* ... */ })
vapi.on('speech-end', () => { /* ... */ })
vapi.on('volume-level', (volume) => { /* ... */ })
vapi.on('error', (error) => { /* ... */ })

// Start a call
await vapi.start(assistantId, assistantOverrides)

// End a call
await vapi.stop()
```

## Testing the Integration

1. Start your development server with `npm run dev`
2. Navigate to the interview page
3. Click "Start Interview" to initiate a Vapi conversation
4. Make sure your browser has permission to access your microphone

## Troubleshooting

If you encounter issues with the Vapi integration:

- Check browser console for any errors
- Verify your API key and assistant ID are correct
- Make sure your browser has microphone permissions
- Ensure your Vapi assistant is properly configured
- If you see "VapiWebConfig is not a constructor" error, ensure you're importing and using the SDK correctly

### Empty Error Object (`{}`)

If you see an empty error object (`Vapi error: {}`), try these steps:

1. **Check API Key**: Ensure you're using your public key (not secret key)
2. **Verify Environment Variables**: Make sure NEXT_PUBLIC_VAPI_API_KEY and NEXT_PUBLIC_VAPI_ASSISTANT_ID are properly set
3. **Microphone Access**: Grant microphone permissions to your browser
4. **Network Issues**: Check for CORS or connectivity problems
5. **Create a New Assistant**: If the current assistant is misconfigured, try creating a new one

## Resources

- [Vapi Documentation](https://docs.vapi.ai)
- [Vapi Web SDK Documentation](https://docs.vapi.ai/sdk/web) 