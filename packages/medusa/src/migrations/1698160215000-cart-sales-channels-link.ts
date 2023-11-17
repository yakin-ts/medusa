import { MigrationInterface, QueryRunner } from "typeorm"

export class CartSalesChannelsLink1698160215000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "cart_sales_channel"
        (
--             "id"                character varying        NOT NULL, -- TODO: uncomment
            "cart_id"           character varying        NOT NULL,
            "sales_channel_id"  character varying        NOT NULL,
            "created_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "updated_at"        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at"        TIMESTAMP WITH TIME ZONE,
--             CONSTRAINT "cart_sales_channel_pk"              PRIMARY KEY ("id"),
            CONSTRAINT "cart_sales_channel_pk"              PRIMARY KEY ("cart_id", "sales_channel_id"), -- TODO: remove
            CONSTRAINT "cart_sales_channel_cart_id_unique"  UNIQUE ("cart_id"),
            CONSTRAINT "cart_sales_channel_cart_id_sales_channel_id_unique"  UNIQUE ("cart_id", "sales_channel_id")
            );

        insert into "cart_sales_channel" (id, cart_id, sales_channel_id)
            (select 'cartsc_' || substr(md5(random()::text), 0, 27), id, sales_channel_id from "cart");

        ALTER TABLE "cart" DROP COLUMN IF EXISTS "sales_channel_id";

        ALTER TABLE "cart" DROP CONSTRAINT IF EXISTS "FK_a2bd3c26f42e754b9249ba78fd6";
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "cart" ADD COLUMN IF NOT EXISTS "sales_channel_id";

        UPDATE "cart" SET "sales_channel_id" = "cart_sales_channel"."sales_channel_id"
            FROM "cart_sales_channel"
        WHERE "cart"."id" = "cart_sales_channel"."cart_id";

        DROP TABLE IF EXISTS "cart_sales_channel";

        ALTER TABLE "cart" ADD CONSTRAINT "FK_a2bd3c26f42e754b9249ba78fd6" FOREIGN KEY ("sales_channel_id") REFERENCES "sales_channel"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
    `)
  }
}
