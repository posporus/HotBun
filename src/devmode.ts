/**
 * true if devmode.
 */
export default () => Deno.env.get("HOTBUN_DEVMODE") === 'true'