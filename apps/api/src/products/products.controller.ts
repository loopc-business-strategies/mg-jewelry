import { Controller, Get, Param, Query } from "@nestjs/common";
import type { Locale } from "@mg/shared";
import { ProductsService } from "./products.service";

@Controller()
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get("products")
  list(
    @Query() query: Record<string, string>,
    @Query("locale") locale: Locale = "en",
  ) {
    return this.products.list(query, locale);
  }

  @Get("products/:slug")
  bySlug(
    @Param("slug") slug: string,
    @Query("locale") locale: Locale = "en",
  ) {
    return this.products.bySlug(slug, locale);
  }

  @Get("categories")
  categories(@Query("locale") locale: Locale = "en") {
    return this.products.categories(locale);
  }

  @Get("collections")
  collections(@Query("locale") locale: Locale = "en") {
    return this.products.collections(locale);
  }
}
