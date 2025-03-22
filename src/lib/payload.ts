import payload from 'payload';
import config from '../payload.config';

// Initialize Payload only on the server side
if (typeof window === 'undefined') {
  payload.init({
    config,
  });
}

export default payload;
