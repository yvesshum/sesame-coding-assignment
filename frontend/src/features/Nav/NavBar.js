import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useSelector } from "react-redux";
import truncateEthAddress from "truncate-eth-address";

export function NavBar() {
  const publicKey = useSelector((state) => state.user.publicKey);

  const handleConnectWallet = async () => {
    await window.ethereum?.request({
      method: "eth_requestAccounts",
    });
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">SESAME LABS</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {publicKey ? (
              truncateEthAddress(publicKey)
            ) : (
              <Button onClick={handleConnectWallet} variant="light">
                Connect Wallet
              </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
