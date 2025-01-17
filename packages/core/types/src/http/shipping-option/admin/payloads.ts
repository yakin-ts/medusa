import { RuleOperatorType } from "../../../common"
import { ShippingOptionPriceType } from "../../../fulfillment"

interface AdminCreateShippingOptionRule {
  operator: RuleOperatorType
  attribute: string
  value: string | string[]
}

interface AdminCreateShippingOptionType {
  label: string
  description: string
  code: string
}

interface AdminCreateShippingOptionPriceWithCurrency {
  currency_code: string
  amount: number
}

interface AdminCreateShippingOptionPriceWithRegion {
  region_id: string
  amount: number
}

export interface AdminCreateShippingOption {
  name: string
  service_zone_id: string
  shipping_profile_id: string
  data?: Record<string, unknown>
  price_type: ShippingOptionPriceType
  provider_id: string
  type: AdminCreateShippingOptionType
  prices: (
    | AdminCreateShippingOptionPriceWithCurrency
    | AdminCreateShippingOptionPriceWithRegion
  )[]
  rules?: AdminCreateShippingOptionRule[]
}

interface AdminUpdateShippingOptionRule extends AdminCreateShippingOptionRule {
  id: string
}

interface AdminUpdateShippingOptionPriceWithCurrency {
  id?: string
  currency_code?: string
  amount?: number
}

interface AdminUpdateShippingOptionPriceWithRegion {
  id?: string
  region_id?: string
  amount?: number
}

export interface AdminUpdateShippingOption {
  name?: string
  data?: Record<string, unknown>
  price_type?: ShippingOptionPriceType
  provider_id?: string
  shipping_profile_id?: string
  type?: AdminCreateShippingOptionType
  prices?: (
    | AdminUpdateShippingOptionPriceWithCurrency
    | AdminUpdateShippingOptionPriceWithRegion
  )[]
  rules?: (AdminUpdateShippingOptionRule | AdminCreateShippingOptionRule)[]
}

export interface AdminUpdateShippingOptionRules {
  create?: any[]
  update?: any[]
  delete?: string[]
}
