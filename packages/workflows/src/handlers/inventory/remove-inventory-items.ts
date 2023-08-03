import { InventoryItemDTO } from "@medusajs/types"
import { WorkflowArguments } from "../../helper"

export async function removeInventoryItems({
  container,
  context,
  data,
}: Omit<WorkflowArguments, "data"> & {
  data: {
    inventoryItems: { inventoryItem: InventoryItemDTO }[]
  }
}) {
  const { manager } = context
  const data_ = data.inventoryItems

  const inventoryService = container.resolve("inventoryService")

  if (!inventoryService) {
    const logger = container.resolve("logger")
    logger.warn(
      `Inventory service not found. You should install the @medusajs/inventory package to use inventory. The 'removeInventoryItems' will be skipped.`
    )
    return
  }

  return await inventoryService!.deleteInventoryItem(
    data_.map(({ inventoryItem }) => inventoryItem.id),
    { transactionManager: manager }
  )
}

removeInventoryItems.aliases = {
  inventoryItems: "inventoryItems",
}
