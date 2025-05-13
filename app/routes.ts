import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [index("routes/home.tsx"),route('kontrakter', "routes/contractList.tsx")] satisfies RouteConfig;

