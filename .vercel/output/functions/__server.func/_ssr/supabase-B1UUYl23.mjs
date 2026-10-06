import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-B1UUYl23.js
var url = "https://vptnxkqyptsxurhaqqlp.supabase.co".trim();
var publishableKey = "sb_publishable_mcoT7cCuOeEYabtgFTXisA_TZSAbCqq".trim();
var supabase = Boolean(publishableKey) ? createClient(url, publishableKey) : null;
//#endregion
export { supabase as t };
