import { FlagSettings } from "../../types/feature-flags"

const IsolateSalesChannelDomainFeatureFlag: FlagSettings = {
  key: "isolate_sales_channel_domain",
  default_val: false,
  env_key: "MEDUSA_FF_ISOLATE_SALES_CHANNEL_DOMAIN",
  description: "[WIP] Isolate sales channel domain from the core",
}

export default IsolateSalesChannelDomainFeatureFlag