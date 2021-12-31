import response from '../utils/response';
import { addNewAppsService, getAllAppsService } from '../services/apps';

export async function handleGetAllApps(ctx) {
  const data = await getAllAppsService(ctx.request.body);
  response.success(ctx, data);
}

export async function handleAddNewApp(ctx) {
  const { id } = await addNewAppsService(ctx.request.body);
  response.success(ctx, { id });
}
