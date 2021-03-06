import response from '../utils/response';
import {
  addNewAppsService,
  delAppByIdService,
  editAppInfoService,
  getAllAppsService,
  getAppInfoByIdService
} from '../services/apps';

export async function handleGetAllApps(ctx) {
  const data = await getAllAppsService(ctx.request.body);
  response.success(ctx, data);
}

export async function handleAddNewApp(ctx) {
  const { id } = await addNewAppsService(ctx.request.body);
  response.success(ctx, { id });
}

export async function handleGetAppInfoById(ctx) {
  const { id } = ctx.params;
  const data = await getAppInfoByIdService(id);
  response.success(ctx, data);
}

export async function handleEditAppInfoById(ctx) {
  const data = await editAppInfoService(ctx.request.body);
  response.success(ctx, data);
}

export async function handleDelAppInfoById(ctx) {
  const { id } = ctx.params;
  const data = await delAppByIdService(id);
  response.success(ctx, data);
}
