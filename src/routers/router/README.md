# Router 约定

- 每个子路由使用 `new Router({ prefix })`，在路由内部使用相对路径（如 `/login`）。
- 路由处理链建议顺序：`validateBody` → `authenticate/permissions` → `errorControllerWrapper(controller)`。
- `ApiPrefix` 由环境变量 `API_PREFIX` 控制，在根路由中统一挂载（例如 `/api`），默认空字符串不改变现有路径。
