
import './App.css';
import {useQuery, useMutation, useSubscription, gql} from '@apollo/client'

const SCHEME = gql`
query users($id: ID!){
  users(id: $id){
    id
    name
  }
}
`
const MUTATION_SCHEME = gql`
mutation deleteUser($id: ID!){
  deleteUser(id: $id)
}
`

const AllUsers = gql`
query{
  allUsers{
    id
    name
  }
}
`

const SUBSCRIPTION = gql`
subscription{
  getUsers{
    id
    name
  }
}
`

function App() {
  const {data} = useQuery(AllUsers)

  const [deleteUser, {data: mutData}] = useMutation(MUTATION_SCHEME,{
    update: (cache, data) =>{
      console.log(data)
    }
  })

  useSubscription(SUBSCRIPTION, {
    onSubscriptionData: ({client: {cache}, SubscriptionData: {data}})=>{
      cache.modify({
        fields:{
          allUsers: (allUsers = [])=>{}
        }
      })
    },
  })

  const render = (id)=>{
    deleteUser({
      variables:{
        id
      }
    })
    console.log(id);
  }

  return (
    <>
      {
        data && data.allUsers.map(e => (
          <div key={e.id}>
            <h1>{e.name}</h1>
            <button onClick={()=>render(e.id)}>Delete</button>
          </div>
        ))
      }
    </>
  );
}

export default App;
