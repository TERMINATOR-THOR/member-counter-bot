import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import * as packageJSON from '../../../package.json';
import timeoutFetch from '../../utils/timeoutFetch';

export default async (resource: string): Promise<number> => {
  const controller = new AbortController();
  const response = await timeoutFetch(10000, fetch(`https://api.mcsrvstat.us/2/${resource}`, {
    signal: controller.signal,
    headers: {
      'User-Agent': `Member Counter Discord Bot/${packageJSON.version}`,
    },
  }), controller);

  if (response.status === 200) {
    const result = await response.json();
    return result?.players?.online;
  } else {
    controller.abort();
    throw new Error(`[MINECRAFT] Invalid status code (not 200) in: ${resource}`);
  }
}