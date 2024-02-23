require('../models')
const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')

const URL_BASE = '/products'
const URL_BASE_USER = '/users'

let TOKEN
let productId
let category
let product

beforeAll(async () => {
  //Login
    const user = {
        email: "johancasso0@gmail.com",
        password: "Esteban1234"
    }

    const res = await request(app)
    .post(`${URL_BASE_USER}/login`)
    .send(user)
    
    TOKEN = res.body.token

    //Generamos una categoria
    category = await Category.create({
      name: "Tecnologia"
    })

    product = {
        title: "Ipone 15 pro-max",
        description: "Lorem20",
        price: 2000,
        categoryId: category.id
    }
})

test("POST -> 'URL_BASE', should return status code 201, res.body to be defined and res.body.title === product.title", async () => {
    const res = await request(app)
      .post(URL_BASE)
      .send(product)
      .set('Authorization', `Bearer ${TOKEN}`)

    productId = res.body.id
  
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
})

test("GET -> 'URL_BASE', should return status code 200, res.body to be defined and res.body.length === 1", async () => {
    const res = await request(app)
      .get(URL_BASE)

    // console.log(res.body)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].category.id).toBe(category.id)
})

test("GET -> 'URL_BASE', should return stattus coe 200, re.body to be defined and res.body.length === 1, res.body[0].categoryId === category.id, res.body[0].category.id === category.id",async () => {
  const res = await request(app)
    .get(`${URL_BASE}?query=${category.id}`)

  expect(res.statusCode).toBe(200)
  expect(res.body).toBeDefined()
  expect(res.body).toHaveLength(1)

  expect(res.body[0].categoryId).toBeDefined()
  expect(res.body[0].categoryId).toBe(category.id)

  expect(res.body[0].category).toBeDefined()
  expect(res.body[0].category.id).toBe(category.id)



})

test("GET -> 'URL_BASE/:id', should retun status code 200, res.body to be defined, and res.body.title === product.title", async () => {
    const res = await request(app)
      .get(`${URL_BASE}/${productId}`)
      
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)

    expect(res.body.category).toBeDefined()
    expect(res.body.category.id).toBe(category.id)
})

test("PUT -> 'URL_BASE/:id', should return status code 200, res.body to be defined, and res.body.title === 'Mac x12'", async () => {
    const res = await request(app)
      .put(`${URL_BASE}/${productId}`)
      .send({ title: "Mac x12" })
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe("Mac x12")
})

test("DELETE -> 'URL_BASE/:id', should return status code 204", async () => {
    const res = await request(app)
      .delete(`${URL_BASE}/${productId}`)
      .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)

    await category.destroy()
})