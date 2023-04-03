import { HomeContainer, Product, SkeletonContainer } from "@/styles/pages/home";
import Image from "next/image";

import { useKeenSlider } from "keen-slider/react";

import "keen-slider/keen-slider.min.css";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { CartButton } from "../components/CartButton";
import { useCart } from "../hooks/useCart";
import { IProduct } from "../context/CartContext";
import { MouseEvent, useEffect, useState } from "react";
import { ProductSkeleton } from "../components/ProductSkeleton";

interface HomeProps {
  products: IProduct[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  const { addToCart, checkIfItemAlreadyExists } = useCart();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // fake loading to use the skeleton loading from figma
    const timeOut = setTimeout(() => setIsLoading(false), 2000);

    return () => clearTimeout(timeOut);
  }, []);

  function handleAddToCart(
    e: MouseEvent<HTMLButtonElement>,
    product: IProduct
  ) {
    e.preventDefault();
    addToCart(product);
  }

  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      <HomeContainer>
        {isLoading ? (
          <SkeletonContainer>
            <ProductSkeleton />
            <ProductSkeleton  />
            <ProductSkeleton />
          </SkeletonContainer>
        ) : (
          <div ref={sliderRef} className="keen-slider">
            {products.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                prefetch={false}
              >
                <Product className="keen-slider__slide">
                  <Image src={product.imgUrl} width={520} height={520} alt="" />

                  <footer>
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.price}</span>
                    </div>

                    <CartButton
                      color="green"
                      size="large"
                      disabled={checkIfItemAlreadyExists(product.id)}
                      onClick={(e) => handleAddToCart(e, product)}
                    />
                  </footer>
                </Product>
              </Link>
            ))}
          </div>
        )}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imgUrl: product.images[0],
      price: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format((price.unit_amount as number) / 100),
      numberPrice: price.unit_amount / 100,
      defaultPriceId: price.id,
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // hours
  };
};
