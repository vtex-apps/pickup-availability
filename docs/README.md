# Pickup Availability

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[<i class="fa-brands fa-github"></i> Source code](https://github.com/vtex-apps/pickup-availability)

The Pickup Availability app allows you to add a component to your store's product pages that displays in-store pickup availability for a selected SKU. This helps customers quickly see if they can collect an item from a physical store.

>ℹ️ This component uses the [`ProductContext`](https://developers.vtex.com/docs/apps/vtex.product-context) app and should be implemented inside the `store.product` block. 

## Before you begin

Make sure you have configured in-store pickup for your store, including pickup points and shipping policies.

## Installation

1. Open your [Store theme](https://developers.vtex.com/docs/guides/vtex-io-documentation-store-theme) project in a code editor.
2. In the terminal, [install](https://developers.vtex.com/docs/guides/vtex-io-documentation-installing-an-app) the `pickup-availability` app in your account by running the `vtex install vtex.pickup-availability` command.
3. Add the `pickup-availability` app to your theme's `manifest.json` file under `peerDependencies`:

  ```json
  "peerDependencies": {
    	"vtex.pickup-availability": "0.x"
  }
  ```
## Configuration

Declare the `pickup-availability` block in the desired product template, such as `store.product`. For example:

```json
"store.product": {
  "children": [
      "flex-layout.row#product-main",
      "flex-layout.row#description",
      "shelf.relatedProducts",
      "pickup-availability"
    ]
 },
```

## Customization

To apply CSS customizations on this and other blocks, you can use the following CSS Handles. For detailed instructions, see the guide [Using CSS Handles for store customization](https://vtex.io/docs/recipes/style/using-css-handles-for-store-customization).

| CSS Handles                         |
| ------------------------------------|
| `availabilityAction`                |
| `availabilityButtonContainer`       |
| `availabilityHeader`                |
| `availabilityMessage`               |
| `container`                         |
| `innerContainer`                    |
| `shippingEstimate[--]{timeModifier}`|

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/brunormoreira/"><img src="https://avatars2.githubusercontent.com/u/27451066?v=4" width="100px;" alt=""/><br /><sub><b>Bruno Moreira</b></sub></a><br /><a href="https://github.com/vtex-apps/pickup-availability/commits?author=brunorodmoreira" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
