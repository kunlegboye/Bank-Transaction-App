import app from "../src/app";
const supertest = require("supertest")
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from 'dotenv';



let mongoServer: MongoMemoryServer

beforeAll(async() => {
  dotenv.config();
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  mongoose
  .connect(uri, {
    useNewUrlParser : true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected Successfully.')
  })
  jest.setTimeout(10*1000)
}, 10000)
afterAll(async() => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
})

import Account from "../src/models/balanceModel";

let token: string
//Test cases for all registered users 
describe("Test for all registered Users endpoint", () => { 
  it('Creates an account', async() => {
    const newBalance = await Account.create({
      accountNumber: "1278946355",
      amount: "10010",
    });
    expect(newBalance.accountNumber).toBe("1278946355")
    expect(newBalance.amount).toBe("10010")
  })

  it("Throw error for an unsuccessful creation of a new user", async() => {
    const userInfo = {
      name:"Sunday",
      email: "sunday@gmail.com",
      password: "123456783",
      repeat_password:"123456738"
    }
    await supertest(app)
    .post("/users/signup")
    .send(userInfo)
    .set("Accept", "application/json")
    .expect(404)
    .expect((res: any) => {
      expect(res.body.message).toBe("validation Error")
    })
  })
  it("Successfully creates a new user", async() => {
    const userInfo = {
      name:"Sunday",
      email: "sunday@gmail.com",
      password: "123456783",
      repeat_password:"123456783"
    }
    await supertest(app)
    .post("/users/signup")
    .send(userInfo)
    .set("Accept", "application/json")
    .expect(201)
    .expect((res: any) => {
      expect(res.body.message).toBe("You have succesfully signed up")
    })
  })
  it("Throws error for an unvalidated user", async() => {
    const userInfo = {
      email: "",
      password: ""
    }
    await supertest(app)
    .post("/users/login")
    .send(userInfo)
    .set("Accept", "application/json")
    .expect(404)
    .expect((res: any) => {
      expect(res.body.message).toBe("validation Error")
    })
  })
  it("Throws error for an unregistered user trying to log in", async() => {
    const userInfo = {
      email: "edostate@gmail.com",
      password: "111111111"
    }
    await supertest(app)
    .post("/users/login")
    .set("Accept", "application/json")
    .send(userInfo)
    .expect(404)
    .expect((res: any) => {
      expect(res.body.message).toBe('Not A Registered User')
    })
  })
  it("Successfully logs in a registered user", async() => {
    const userInfo = {
      email: "sunday@gmail.com",
      password: "123456783"
    }
    await supertest(app)
    .post("/users/login")
    .set("Accept", "application/json")
    .send(userInfo)
    .expect(201)
    .expect((res: any) => {
      token = res.body.token
      expect(res.body.message).toBe("You have succesfully logged in")
    })
  })
  it("Throw error for an unsuccessful log in of a registered user", async() => {
    const userInfo = {
      email: "sunday@gmail.com",
      password: "123456738"
    }
    await supertest(app)
    .post("/users/login")
    .send(userInfo)
    .set("Accept", "application/json")
    .expect(404)
    .expect((res: any) => {
      expect(res.body.message).toBe("Invalid details")
    })
  })
  it("Get all registered user", async() => {
    await supertest(app)
    .get("/users")
    .set("Accept", "application/json")
    .set("Cookie",`jwt=${token}`)
    .expect(200)
    .expect((res: any) => {
      expect(res.body).not.toBeNull()
      expect(res.body.result).not.toHaveLength(0)
    })
  })

 //Test cases for all balances route
 it("Throw error for an unsuccessful validation of account inputs", async() => {
  const userInfo = {
    accountNumber: "",
    amount: ""
  }
  await supertest(app)
  .post("/account/create")
  .send(userInfo)
  .set("Accept", "application/json")
  .set("Cookie",`jwt=${token}`)
  .expect(404)
  .expect((res: any) => {
    expect(res.body.message).toBe("validation Error")
  })
})


 it("Test for Successful creation of account", async() => {
  const userInfo = {
    accountNumber: "1234567890",
    amount: "70000"
  }
  await supertest(app)
  .post("/account/create")
  .send(userInfo)
  .set("Accept", "application/json")
  .set("Cookie",`jwt=${token}`)
  .expect(201)
  .expect((res: any) => {
    expect(res.body.data.message).toBe("You have successfully created an account!")
  })
})
it("Get all registered user account information", async() => {
  await supertest(app)
  .get("/account/balance")
  .set("Accept", "application/json")
  .set("Cookie",`jwt=${token}`)
  .expect(200)
  .expect((res: any) => {
    expect(res.body).not.toBeNull()
    expect(res.body.result).not.toHaveLength(0)
  })
})
it("Successfully get single user's balance in the dataBase", async () => {
  await supertest(app)
  .get("/account/balance/1234567890")
  .set("Accept","application/json")
  .set("Cookie", `jwt=${token}`)
  .expect(200)
  .expect((res: any) => {
    expect(res.body.data.data).not.toBeNull()
  })
})

/// Test for Transactions
it("Throw error for an unsuccessful creation of transaction", async() => {
  const userInfo = {
    from: "1234567890",
    to: "0987654321",
    transferDescription: "",
    amount:"",
  }
  await supertest(app)
  .post("/transaction/transfer")
  .send(userInfo)
  .set("Accept", "application/json")
  .set("Cookie", `jwt=${token}`)
  .expect(404)
  .expect((res: any) => {
    expect(res.body.message).toBe("validation Error")
  })
})
it("Successfully creation of transaction", async() => {
  const userInfo = {
    from: "1234567890",
    to: "1278946355",
    transferDescription: "transfer from babalola",
    amount:"2000",
  }
  await supertest(app)
  .post("/transaction/transfer")
  .send(userInfo)
  .set("Accept", "application/json")
  .set("Cookie", `jwt=${token}`)
  .expect(201)
  .expect((res: any) => {
    expect(res.body.message).toBe("transaction created!")
  })
})


test("it should get all  transactions in database", async () => {
  await supertest(app)
  .get("/transaction")
  .set("Accept", "application/json")
  .set("Cookie",`jwt=${token}`)
  .expect(200)
  .expect((res: any) => {
    expect(res.body).not.toBeNull()
    expect(res.body.result).not.toHaveLength(0)
  })
});

})