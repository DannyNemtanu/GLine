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

  constructor(
    private router: Router
  ) {}

  ngOnInit() {}
  searchCategory(event, query) {
    this.router.navigate(['/products', query]).then(() => {
      if (this.router.url.indexOf('/products/') > -1) {
        window.location.reload();
      }
    });
  }
}
