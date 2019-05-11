import {
  Component,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  myMarkets = [{
      name: 'Consumer Electronics',
    },
    {
      name: 'Lights & Lighting',
    },
    {
      name: 'Vehicles & Accessories',
    },
    {
      name: 'Security & Protection',
    },
    {
      name: 'Construction & Real Estate',
    },
    {
      name: 'Gifts & Crafts',
    }
  ];
  allCategories = [
    [{
        name: 'Machinery / '
      },
      {
        name: 'Fabrication Service'
      },
    ],
    [{
        name: 'Consumer Electronics / '
      },
      {
        name: 'Home Appliances'
      },
    ],
    [{
        name: 'Vehicles & Accessories / '
      },
      {
        name: 'Sports & Entertainment'
      },
    ],
    [{
        name: 'Apparel / '
      },
      {
        name: 'Textiles / '
      },
      {
        name: 'Timepieces / '
      },
      {
        name: 'Accessories'
      },
    ],
    [{
        name: 'Home & Garden / '
      },
      {
        name: 'Lights / '
      },
      {
        name: 'Furniture / '
      },
      {
        name: 'Construction'
      },
    ],
    [{
        name: 'Beauty & Personal Care / '
      },
      {
        name: 'Health & Medical'
      },
    ],
    [{
        name: 'Packaging & Printing / '
      },
      {
        name: 'Office & School / '
      },
      {
        name: 'Service Equipment'
      },
    ],
    [{
        name: 'Electrical /  '
      },
      {
        name: 'Tools & Hardware /  '
      },
      {
        name: 'Security & Protection'
      },
    ],
    [{
        name: 'Electronic Components /  '
      },
      {
        name: 'Telecommunications '
      },
    ],
    [{
        name: 'Toys & Hobbies /  '
      },
      {
        name: 'Gifts & Crafts'
      },
    ],
    [{
        name: 'Luggage， Bags & Cases /  '
      },
      {
        name: 'Shoes & Accessories'
      },
    ],
    [{
        name: 'Minerals /  '
      },
      {
        name: 'Chemicals / '
      },
      {
        name: 'Rubber & Plastics / '
      },
      {
        name: 'Energy'
      },
    ]
  ];
  allSections = [{
    name: 'Consumer Electronics',
    title: 'Selected Novelty Products',
    image: '../../../assets/images/categories/Consumer Electronics/main.png',
    data: [
      [{
          title: 'Mobile Phone',
          image: '../../../assets/images/categories/Consumer Electronics/mobile-phone.jpg'
        },
        {
          title: 'Mobile Phone Bags & Cases',
          image: '../../../assets/images/categories/Consumer Electronics/cases.jpg'
        }, {
          title: 'Speakers',
          image: '../../../assets/images/categories/Consumer Electronics/speakers.jpg'
        }, {
          title: 'Mobile Phone Housings',
          image: '../../../assets/images/categories/Consumer Electronics/parts.jpg'
        },
      ],
      [{
        title: 'Amplifiers',
        image: '../../../assets/images/categories/Consumer Electronics/amplifiers.jpg'
      }, {
        title: 'Other Audio & Video Equipments',
        image: '../../../assets/images/categories/Consumer Electronics/video.jpg'
      }, {
        title: 'Screen Protectors',
        image: '../../../assets/images/categories/Consumer Electronics/screen.jpg'
      }, {
        title: 'Earphone Accessories',
        image: '../../../assets/images/categories/Consumer Electronics/earphones.jpg'
      }, ]
    ]
  }, ];
  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // console.log(this.myMarkets);

    // console.log(this.allSections);
  }
  searchCategory(event, query) {
    this.router.navigate(['/products', query]).then(() => {
      if (this.router.url.indexOf('/products/') > -1) {
        window.location.reload();
      }
    });
  }
}
