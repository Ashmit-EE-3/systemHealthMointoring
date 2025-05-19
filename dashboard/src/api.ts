import axios from 'axios';
import { SystemCheck, SystemQuery } from '../../client/src/types';

export async function fetchSystems(query?: SystemQuery): Promise<SystemCheck[]> {
  const params = query ? { ...query } : undefined;
  const res = await axios.get(`http://localhost:3000/api/v1/system/getSystem`, { params });
  return res.data.data;
}

export async function exportSystemsCSV(): Promise<Blob> {
  const res = await axios.get(`http://localhost:3000/api/v1/system/exportData`, {
    responseType: 'blob',
  });
  return res.data;
} 