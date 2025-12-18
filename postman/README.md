Postman Collection - Designer Marketplace

Import steps:
1. Open Postman.
2. Click 'Import' -> 'File' and select `Designer-Marketplace.postman_collection.json`.
3. Import the environment file `Designer-Marketplace.postman_environment.json` (or create an environment with `baseUrl` set to `http://localhost:8080`).
4. Select the `Designer Marketplace Local` environment in the top-right.

Requests included:
- `Health - GET /api/auth/test` : Check backend reachability
- `Register - POST /api/auth/register` : Create a new user (sample body provided)
- `Login - POST /api/auth/login` : Login using `emailOrUsername` and `password`

How to run:
- Run `Health` first to confirm backend is running.
- Use `Register` to create a new user or use seeded users (`john_client` / `password123`).
- Run `Login` and inspect the response; it should return `accessToken` and `refreshToken` on success.

Share results:
- After you run `Login`, copy the response body and paste it in your reply here so I can help further.
