import { styled } from "@/styles"

const Button = styled('button', {
  backgroundColor: '$gray300',
  fontSize: 20,

  '&:hover': {
    backgroundColor: '#000',
  }
})

export default function Home() {
  return (
    <Button>
      enviar
    </Button>
  )
}
