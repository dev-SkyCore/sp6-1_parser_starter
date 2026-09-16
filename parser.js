// @todo: напишите здесь код парсера

function parsePage() {
  const opengraph = {};
  document.querySelectorAll('html meta[property^="og:"]').forEach(el => {
    opengraph[el.getAttribute('property').split(':')[1]] = el.getAttribute('content');
  })

  const images = [];
  document.querySelectorAll('main .product nav button img').forEach(el => {
    const image = {
      preview: el.getAttribute('src'),
      full: el.getAttribute('data-src'),
      alt: el.getAttribute('alt'),
    };

    images.push(image);
  })

  const tags = {
    category: [],
    label: [],
    discount: []
  };

  document.querySelectorAll('.tags span').forEach(tag => {
    if (tag.classList.contains('green')) {
      tags.category.push(tag.textContent);
    } else if (tag.classList.contains('blue')) {
      tags.label.push(tag.textContent);
    } else if (tag.classList.contains('red')) {
      tags.discount.push(tag.textContent);
    }
  })

  const price = +(document.querySelector('.product .price').textContent.split('\n')[1].trim().slice(1));
  const oldPrice = +(document.querySelector('.product .price').textContent.split('\n')[2].trim().slice(1));
  const discount = oldPrice - price;

  let discountPercent = '0%';

  if (price !== oldPrice) {
    discountPercent = (discount * 100 / oldPrice).toFixed(2) + '%';
  }

  let currency = 'RUB';
  const currencySymbol  = document.querySelector('.product .price').textContent.split('\n')[1].trim().slice(0, 1);

  if (currencySymbol === '$') {
    currency = 'USD';
  } else if (currencySymbol === '€') {
    currency = 'EUR';
  }

    return {
        meta: {
          title: document.querySelector('html head title').textContent.split('—')[0].trim(),
          language: document.querySelector('html').getAttribute('lang'),
          keywords: document.querySelector('html meta[name="keywords"]').getAttribute('content').split(','),
          description: document.querySelector('html meta[name="description"]').getAttribute('content'),
          opengraph: opengraph,
        },
        product: {
          id: document.querySelector('main .product').getAttribute('data-id'),
          images: images,
          isLiked: document.querySelector('main .product .like').classList.contains('active'),
          name: document.querySelector('h1').textContent,
          tags: tags,
          price: price,
          oldPrice: oldPrice,
          discount: discount,
          discountPercent: discountPercent,
          currency: currency,
        },
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;