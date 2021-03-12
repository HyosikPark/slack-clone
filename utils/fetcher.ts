import axios from 'axios';

export function fetcher(url: string) {
  return axios.get(url, { withCredentials: true }).then((res) => res.data);
}
