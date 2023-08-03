import { ProductTypes, WorkflowTypes } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { WorkflowArguments } from "../../helper"

type ProductHandle = string
type VariantIndexAndPrices = {
  index: number
  prices: WorkflowTypes.ProductWorkflow.ProductVariantPricesCreateReq[]
}

export async function updateProductsVariantsPrices({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    input: {
      productsHandleVariantsIndexPricesMap: Map<
        ProductHandle,
        VariantIndexAndPrices[]
      >
    }
    products: ProductTypes.ProductDTO[]
  }
}) {
  const { manager } = context
  const products = data.products
  const productsHandleVariantsIndexPricesMap =
    data.input.productsHandleVariantsIndexPricesMap

  const productVariantService = container.resolve("productVariantService")
  const productVariantServiceTx = productVariantService.withTransaction(manager)

  const variantIdsPricesData: any[] = []
  const productsMap = new Map<string, ProductTypes.ProductDTO>(
    products.map((p) => [p.handle!, p])
  )

  for (const mapData of productsHandleVariantsIndexPricesMap.entries()) {
    const [handle, variantData] = mapData

    const product = productsMap.get(handle)
    if (!product) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Product with handle ${handle} not found`
      )
    }

    variantData.forEach((item, index) => {
      const variant = product.variants[index]
      variantIdsPricesData.push({
        variantId: variant.id,
        prices: item.prices,
      })
    })
  }

  await productVariantServiceTx.updateVariantPrices(variantIdsPricesData)
}

updateProductsVariantsPrices.aliases = {
  input: "input",
  products: "products",
}
