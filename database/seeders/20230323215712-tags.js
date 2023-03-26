'use strict'
const { Op } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkInsert('Tags', [
        {
          id: '1',
          name: 'Ropa y accesorios',
          description: 'This tag is used for publications related to fashion, clothing and clothing accessories, from apparel to accessories such as handbags, shoes and jewelry.',
          image_url: 'https://paracuando.com/image1.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '2',
          name: 'Deportes',
          description: 'This tag is used for publications related to the world of sports, including competitions, events, training and sports equipment.',
          image_url: 'https://paracuando.com/image2.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '3',
          name: 'Conciertos',
          description: 'This tag refers to publications related to live music concerts. It includes information about artists, dates, venues, tickets and everything related to the experience of attending a concert.',
          image_url: 'https://paracuando.com/image3.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '4',
          name: 'Meet & Greet',
          description: 'This tag is used to identify events that include a meet and greet with an artist, athlete, or celebrity',
          image_url: 'https://paracuando.com/image4.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '5',
          name: 'E-sport',
          description: 'This tag refers to electronic sports, also known as e-sports, which involve online video game competitions between professional or amateur players and teams.',
          image_url: 'https://paracuando.com/image5.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '6',
          name: 'Pop / Rock',
          description: 'This tag is perfect for those who love pop and rock music. It includes concerts, festivals and other events related to these musical genres.',
          image_url: 'https://paracuando.com/image6.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '7',
          name: 'Tecnología',
          description: 'This tag is related to news, events and developments related to technology, electronics, innovation and technological advances.',
          image_url: 'https://paracuando.com/image7.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '8',
          name: 'Hogar y Decoración',
          description: 'This tag is related to products and services related to home and decoration, such as furniture, textiles, decoration, gardening, household appliances, among others.',
          image_url: 'https://paracuando.com/image8.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: '9',
          name: 'Abastecimiento',
          description: 'This tag is used for publications related to the purchase of products or materials necessary for the production or operation of a company or business.',
          image_url: 'https://paracuando.com/image9.png',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ], { transaction })

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, /*Sequelize*/) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.bulkDelete('Tags', {
        name: {
          [Op.or]: [
            'Ropa y accesorios',
            'Deportes',
            'Conciertos',
            'Meet & Greet',
            'E-sport',
            'Pop / Rock',
            'Tecnología',
            'Hogar y Decoración', 
            'Abastecimiento'
          ]
        }
      }, { transaction })
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
