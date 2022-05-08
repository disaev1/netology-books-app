import axios, { AxiosResponse } from 'axios';

interface CounterResponse {
  value: number;
}

interface CounterIncrResponse {
  newValue: number;
}

interface Counts {
  [id: string]: number;
}

const incrCounter = async (id: string): Promise<number> => {
  const { data }: AxiosResponse<CounterIncrResponse> = await axios.post(`http://counter:3000/counter/${id}/incr`);

  return Number(data.newValue);
};

const getCounters = async (ids: string[]): Promise<Counts> => {
  const responses: AxiosResponse<CounterResponse>[] = await Promise.all(
    ids.map(id => axios.get<CounterResponse>(`http://counter:3000/counter/${id}`))
  );

  return responses.reduce((acc: Counts, response: AxiosResponse<CounterResponse>, index: number): Counts => {
    acc[ids[index]] = Number(response.data.value);

    return acc;
  }, {});
};

export { incrCounter, getCounters, Counts };
