import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient()

async function main(){
    const coach1 = await prisma.coach.upsert({
        where:{id: 1},
        update:{},
        create:{
            email: 'coach1@covelant.com',
            team: 'team1',
            avatar: "/testImages/coach1.jpg",
            firstName: "Master",
            lastName: "Coach",
            players:{
                create:[{
                    firstName: 'Terminator',
                    lastName: 'genesis',
                    email: 'savejhonconnor@covelant.com',
                    avatar: "/testImages/player1.jpg"
                },
            {
                    firstName: 'Avatar',
                    lastName: 'Aang',
                    email: 'mycagabages@covelant.com',
                    avatar: "/testImages/player2.jpg"
                },
                {
                    firstName: 'darth',
                    lastName: 'vader',
                    email: 'iamyourfather@covelant.com',
                    avatar: "/testImages/player3.jpg"
                },
                {
                    firstName: 'aragorn',
                    lastName: 'son of arathorn',
                    email: 'forFrodo@covelant.com',
                    avatar: "/testImages/test.jpg"
                }
            ]
            }
        }
    })
    const coach2 = await prisma.coach.upsert({
        where:{id: 2},
        update:{},
        create:{
            email: 'coach2@covelant.com',
            team: 'team2',
            firstName: "Master",
            lastName: "Coach",
            players:{}
        }
    })
    console.log({ coach1, coach2 })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })