function generateShopifyProductURL(storeDomain: any, product: { title: any; }) {
    const { title } = product;
    // Convert the title to a handle (lowercase, spaces to hyphens, remove special characters)
    const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    return `https://${storeDomain}.myshopify.com/products/${handle}`;
}

function generateProductDescription(domain: string, product: any) {
    const { title, body_html, product_type, tags, variants, images } = product;
    const variantInfo = variants.map((variant: any) => `${variant.title} - $${variant.price}`).join(', ');

    const description = body_html.replace(/<\/?[^>]+(>|$)/g, "");

    const mainImage = images.length > 0 ? images[0].src : '';

    const finalDescription = `
        Product: ${title}
        Type: ${product_type}
        Description: ${description}
        Tags: ${tags}
        Available Variants: ${variantInfo}
        Image: ${mainImage}
        Url: ${generateShopifyProductURL(domain, product)}
    `;

    return finalDescription.trim();
}



export const fetchProducts = async (domain: string, token: string) => {
    try {
        const URL = `https://${domain}.myshopify.com/admin/api/2024-01/products.json`
        const data = await fetch(URL,
            {
                method: 'GET',
                headers: {
                    Accept: '*/*',
                    'X-Shopify-Access-Token': token,
                    'Content-Type': 'application/json'
                }
            }
        )

        const response = await data.json() as any

        const parse = response.products.map((p: any) => generateProductDescription(domain, p))

        return parse

    } catch (e) {
        return []
    }
}