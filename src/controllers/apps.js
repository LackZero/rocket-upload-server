import response from '../utils/response';
import { addNewAppsService } from '../services/apps';

export async function handleAddNewApp(ctx) {
  const { id } = await addNewAppsService(ctx.request.body);
  response.success(ctx, { id });
}
