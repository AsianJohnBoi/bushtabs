const axios = require('axios');
const AWS = require('aws-sdk');
const crudPhoto = require('../crud/photos');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: 'ap-southeast-2'
});

async function getPictures() {
    return new Promise((resolve, reject) => {
        axios({
            method: 'get',
            url: `https://api.unsplash.com/photos/random?client_id=${process.env.UNSPLASH_ACCESS_TOKEN}&query=australia&count=5&orientation=landscape`
        })
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    })
}

async function selectNewPhoto() {
    var found = false;
    var selectedPhoto = '';

    try {
        while (!found) {
            // Get a picture
            var data = await getPictures();

            // Check if photo has been used
            for (var i = 0; i < data.length; i++) {
                var exists = await crudPhoto.checkPhoto(data[i]);
                if (!exists) {
                    selectedPhoto = data[i];
                }
            }
            if (selectedPhoto != null) {
                // store new photo in db
                await crudPhoto.storePhoto(selectedPhoto);

                axios.get(selectedPhoto.urls.full, {
                    responseType: 'arraybuffer'
                }).then(response => {
                    const buffer = Buffer.from(response.data);
                    var s3 = new AWS.S3();
                    var params = {
                        Body: buffer,
                        Bucket: process.env.AWS_BUCKET,
                        Key: "images/background.jpg",
                        ACL: 'public-read'
                    }
                    s3.putObject(params, function (err, data) {
                        if (err) console.log(err)
                        console.log(`Uploaded new photo:`, data);
                    })
                })

                found = true;
            }
        }
        return selectedPhoto;
    } catch (e) {
        throw new Error('Error Occurred', e);
    }
}

const data = [
    {
      id: 'jK9dT34TfuI',
      created_at: '2018-04-11T17:38:40-04:00',
      updated_at: '2020-01-07T00:01:28-05:00',
      promoted_at: null,
      width: 5138,
      height: 2423,
      color: '#F4F3F3',
      description: 'Morning Opera',
      alt_description: 'Sydney Opera House, Australia',
      urls: {
        raw: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        full: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        regular: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        small: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        thumb: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ'
      },
      links: {
        self: 'https://api.unsplash.com/photos/jK9dT34TfuI',
        html: 'https://unsplash.com/photos/jK9dT34TfuI',
        download: 'https://unsplash.com/photos/jK9dT34TfuI/download',
        download_location: 'https://api.unsplash.com/photos/jK9dT34TfuI/download'
      },
      categories: [],
      likes: 50,
      liked_by_user: false,
      current_user_collections: [],
      user: {
        id: 'HS3dYkZ_7Wg',
        updated_at: '2020-01-05T09:53:35-05:00',
        username: 'photoholgic',
        name: 'Holger Link',
        first_name: 'Holger',
        last_name: 'Link',
        twitter_username: 'photoholgic',
        portfolio_url: null,
        bio: null,
        location: null,
        links: [Object],
        profile_image: [Object],
        instagram_username: 'photoholgic ',
        total_collections: 1,
        total_likes: 505,
        total_photos: 344,
        accepted_tos: true
      },
      exif: {
        make: 'Canon',
        model: 'Canon EOS 7D',
        exposure_time: '30',
        aperture: '11.0',
        focal_length: '24.0',
        iso: 100
      },
      location: {
        title: 'Sydney Harbour Bridge, Sydney, Australia',
        name: 'Sydney Harbour Bridge, Sydney, Australia',
        city: 'Sydney',
        country: 'Australia',
        position: [Object]
      },
      views: 665688,
      downloads: 5716
    },
    {
      id: 'qrR6DGR7OsE',
      created_at: '2016-06-04T02:54:50-04:00',
      updated_at: '2020-01-07T00:08:00-05:00',
      promoted_at: '2016-06-04T02:54:50-04:00',
      width: 6000,
      height: 4000,
      color: '#FCC903',
      description: 'Rainbow Lorikeet',
      alt_description: 'closeup photo of green and multicolored parrot',
      urls: {
        raw: 'https://images.unsplash.com/photo-1465023215376-3d6b9429bfd6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        full: 'https://images.unsplash.com/photo-1465023215376-3d6b9429bfd6?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        regular: 'https://images.unsplash.com/photo-1465023215376-3d6b9429bfd6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        small: 'https://images.unsplash.com/photo-1465023215376-3d6b9429bfd6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        thumb: 'https://images.unsplash.com/photo-1465023215376-3d6b9429bfd6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ'
      },
      links: {
        self: 'https://api.unsplash.com/photos/qrR6DGR7OsE',
        html: 'https://unsplash.com/photos/qrR6DGR7OsE',
        download: 'https://unsplash.com/photos/qrR6DGR7OsE/download',
        download_location: 'https://api.unsplash.com/photos/qrR6DGR7OsE/download'
      },
      categories: [],
      likes: 242,
      liked_by_user: false,
      current_user_collections: [],
      user: {
        id: 'Aq9kBi58BG4',
        updated_at: '2019-11-29T20:37:09-05:00',
        username: 'idilux',
        name: 'Bri Kelly',
        first_name: 'Bri',
        last_name: 'Kelly',
        twitter_username: null,
        portfolio_url: null,
        bio: null,
        location: null,
        links: [Object],
        profile_image: [Object],
        instagram_username: null,
        total_collections: 1,
        total_likes: 0,
        total_photos: 1,
        accepted_tos: false
      },
      exif: {
        make: 'NIKON CORPORATION',
        model: 'NIKON D3300',
        exposure_time: '1/100',
        aperture: '5.0',
        focal_length: '27.0',
        iso: 140
      },
      location: {
        title: 'Sydney, Australia',
        name: 'Sydney, Australia',
        city: null,
        country: 'Australia',
        position: [Object]
      },
      views: 1354942,
      downloads: 6802
    },
    {
      id: 'o4bJomJEQvc',
      created_at: '2018-07-13T19:42:17-04:00',
      updated_at: '2019-12-28T00:08:07-05:00',
      promoted_at: '2018-07-15T04:13:54-04:00',
      width: 3924,
      height: 2837,
      color: '#E4E4DB',
      description: 'My Mum, Sian Butler, has painted a series of lovely cottages, inspired by what she sees in Tasmania, but also influenced by her living in the UK years ago. They combine a mixture of techniques and textures to produce lively acrylic paintings. Sian is best known for her Australian Outback paintings (she has traveled all around and throughout Australia). Sian is very generous, and delights in sharing her paintings on the internet. She is now eighty, and continues to go from strength to strength, inspiring all those around her with both her paintings and her life.',
      alt_description: 'white house with purple door painting',
      urls: {
        raw: 'https://images.unsplash.com/photo-1531524736789-0b8058644483?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        full: 'https://images.unsplash.com/photo-1531524736789-0b8058644483?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        regular: 'https://images.unsplash.com/photo-1531524736789-0b8058644483?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        small: 'https://images.unsplash.com/photo-1531524736789-0b8058644483?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        thumb: 'https://images.unsplash.com/photo-1531524736789-0b8058644483?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ'
      },
      links: {
        self: 'https://api.unsplash.com/photos/o4bJomJEQvc',
        html: 'https://unsplash.com/photos/o4bJomJEQvc',
        download: 'https://unsplash.com/photos/o4bJomJEQvc/download',
        download_location: 'https://api.unsplash.com/photos/o4bJomJEQvc/download'
      },
      categories: [],
      likes: 68,
      liked_by_user: false,
      current_user_collections: [],
      user: {
        id: 'TYLyWjPA9BM',
        updated_at: '2020-01-07T00:47:15-05:00',
        username: 'davidclode',
        name: 'David Clode',
        first_name: 'David',
        last_name: 'Clode',
        twitter_username: null,
        portfolio_url: 'http://tracts4free.wordpress.com',
        bio: 'I enjoy photography, painting, and nature. I lived in South Africa, the UK, and now Australia. More free paintings, photos available at Tracts4Free.WordPress.com, and Reforestation.me. Also now on YouTube.',
        location: 'Cairns, Queensland, Australia.',
        links: [Object],
        profile_image: [Object],
        instagram_username: null,
        total_collections: 11,
        total_likes: 15784,
        total_photos: 663,
        accepted_tos: true
      },
      exif: {
        make: 'Canon',
        model: 'Canon PowerShot SX700 HS',
        exposure_time: '1/320',
        aperture: '4.0',
        focal_length: '4.5',
        iso: 125
      },
      location: {
        title: 'Tasmania, Australia',
        name: 'Tasmania, Australia',
        city: null,
        country: 'Australia',
        position: [Object]
      },
      views: 397606,
      downloads: 2243
    },
    {
      id: 'M2Kxb80gqcc',
      created_at: '2016-08-06T04:34:03-04:00',
      updated_at: '2020-01-07T00:03:50-05:00',
      promoted_at: '2016-08-06T04:34:03-04:00',
      width: 5472,
      height: 3648,
      color: '#14141A',
      description: 'Explorer’s compass',
      alt_description: 'person holding compass selective focus photography',
      urls: {
        raw: 'https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        full: 'https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        regular: 'https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        small: 'https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        thumb: 'https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ'
      },
      links: {
        self: 'https://api.unsplash.com/photos/M2Kxb80gqcc',
        html: 'https://unsplash.com/photos/M2Kxb80gqcc',
        download: 'https://unsplash.com/photos/M2Kxb80gqcc/download',
        download_location: 'https://api.unsplash.com/photos/M2Kxb80gqcc/download'
      },
      categories: [],
      likes: 807,
      liked_by_user: false,
      current_user_collections: [],
      user: {
        id: 'lQHPVL6K73g',
        updated_at: '2019-12-15T22:01:30-05:00',
        username: 'heidifin',
        name: 'Heidi Fin',
        first_name: 'Heidi',
        last_name: 'Fin',
        twitter_username: 'heidifin',
        portfolio_url: 'https://heidifin.com/',
        bio: 'An Australian-based freelance photographer catching waves, people and rural towns. ',
        location: 'Melbourne, Australia',
        links: [Object],
        profile_image: [Object],
        instagram_username: 'finjournal',
        total_collections: 0,
        total_likes: 1,
        total_photos: 50,
        accepted_tos: true
      },
      exif: {
        make: 'Canon',
        model: 'Canon EOS 6D',
        exposure_time: '1/3200',
        aperture: '3.2',
        focal_length: '35.0',
        iso: 1600
      },
      location: {
        title: 'Melbourne, Australia',
        name: 'Melbourne, Australia',
        city: 'Melbourne',
        country: 'Australia',
        position: [Object]
      },
      views: 5606735,
      downloads: 49250
    },
    {
      id: 'Y61qTmRLcho',
      created_at: '2018-05-27T20:42:18-04:00',
      updated_at: '2019-12-07T00:09:32-05:00',
      promoted_at: '2018-05-28T09:52:32-04:00',
      width: 6000,
      height: 4000,
      color: '#7380A2',
      description: null,
      alt_description: 'stars at sky',
      urls: {
        raw: 'https://images.unsplash.com/photo-1527467779599-34448b3fa6a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        full: 'https://images.unsplash.com/photo-1527467779599-34448b3fa6a7?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        regular: 'https://images.unsplash.com/photo-1527467779599-34448b3fa6a7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        small: 'https://images.unsplash.com/photo-1527467779599-34448b3fa6a7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ',
        thumb: 'https://images.unsplash.com/photo-1527467779599-34448b3fa6a7?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjc1NzQxfQ'
      },
      links: {
        self: 'https://api.unsplash.com/photos/Y61qTmRLcho',
        html: 'https://unsplash.com/photos/Y61qTmRLcho',
        download: 'https://unsplash.com/photos/Y61qTmRLcho/download',
        download_location: 'https://api.unsplash.com/photos/Y61qTmRLcho/download'
      },
      categories: [],
      likes: 73,
      liked_by_user: false,
      current_user_collections: [],
      user: {
        id: 're7dK6Efbcw',
        updated_at: '2019-11-30T10:53:05-05:00',
        username: 'el_ham',
        name: 'Hamish Weir',
        first_name: 'Hamish',
        last_name: 'Weir',
        twitter_username: null,
        portfolio_url: 'http://www.hamishweir.com',
        bio: "Hi, I'm a Graphic Designer based out of Sydney AU.                                \r\n" +
          'For my everyday photos - Instagram: @el_ham',
        location: 'Sydney, Australia',
        links: [Object],
        profile_image: [Object],
        instagram_username: 'el_ham',
        total_collections: 23,
        total_likes: 106,
        total_photos: 42,
        accepted_tos: true
      },
      exif: {
        make: 'FUJIFILM',
        model: 'X-T2',
        exposure_time: '10',
        aperture: '2.0',
        focal_length: '18.0',
        iso: 3200
      },
      location: {
        title: 'Blue Mountains, Australia',
        name: 'Blue Mountains, Australia',
        city: null,
        country: 'Australia',
        position: [Object]
      },
      views: 656182,
      downloads: 6287
    }
  ]

module.exports = {
    getPictures,
    selectNewPhoto
};
