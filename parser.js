// @todo: напишите здесь код парсера

function parsePage() {
  const opengraph = {};
  document.querySelectorAll('html meta[property^="og:"]').forEach(el => {
    opengraph[el.getAttribute('property').split(':')[1]] = el.getAttribute('content').split('—')[0].trim();
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

  function getCurrencySymbol(currencySymbol) {
    let currency = 'RUB';

    if (currencySymbol === '$') {
      currency = 'USD';
    } else if (currencySymbol === '€') {
      currency = 'EUR';
    }

    return currency;
  }


  const properties = {};

  document.querySelectorAll('.properties li').forEach(el => {
    const [key, value] = el.querySelectorAll('span');
    properties[key.textContent] = value.textContent;
  })

  const suggested = [];

  document.querySelectorAll('.suggested article').forEach(el => {
    const cardProduct = {
      name: el.querySelector('h3').textContent,
      description: el.querySelector('p').textContent,
      image: el.querySelector('img').getAttribute('src'),
      price: el.querySelector('b').textContent.slice(1),
      currency: getCurrencySymbol(el.querySelector('b').textContent.slice(0, 1)),
    }
    suggested.push(cardProduct);
  })

  function getRating(data) {
    let counter = 0;
    data.forEach((el) => {
      if (el.classList.contains('filled')) {
        counter++;
      }
    });
    return counter;
  }

  const reviews = [];

  document.querySelectorAll('.reviews article').forEach(el => {
    const review = {
      rating: getRating(el.querySelectorAll('span')),
      author: {
        avatar: el.querySelector('img').getAttribute('src'),
        name: el.querySelector('.author span').textContent,
      },
      title: el.querySelector('h3').textContent,
      description: el.querySelector('p').textContent,
      date: el.querySelector('i').textContent.split('/').join('.'),
    }

    reviews.push(review);
  })

  const descriptionElement = document.querySelector('.product .description');

  descriptionElement.querySelector('h3').removeAttribute('class');

  const description = descriptionElement.innerHTML.trim();

    return {
        meta: {
          title: document.querySelector('html head title').textContent.split('—')[0].trim(),
          language: document.querySelector('html').getAttribute('lang'),
          keywords: document.querySelector('html meta[name="keywords"]').getAttribute('content').split(',').map(keyword => keyword.trim()),
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
          currency: getCurrencySymbol(document.querySelector('.product .price').textContent.split('\n')[1].trim().slice(0, 1)),
          properties: properties,
          description: description,
        },
        suggested: suggested,
        reviews: reviews
    };
}

window.parsePage = parsePage;