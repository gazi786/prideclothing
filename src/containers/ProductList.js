import React from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
    Button,
    Card,
  Container,
    Dimmer,
    Grid,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";

class ProductList extends React.Component {
  state = {
    loading: false,
    error: null,
    data: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get(productListURL)
      .then(res => {
        this.setState({ data: res.data, loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  }

  handleAddToCart = slug => {
    this.setState({ loading: true });
    authAxios
      .post(addToCartURL, { slug })
      .then(res => {
        this.props.refreshCart();
        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    return (
      <Container>
        {error && (
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        
            <Grid stackable columns={3}>
                {data.map(item => {
                            return (
    <Grid.Column key={item.id}>
                    
                       
                <Card>
    <Image src={item.image} wrapped ui={false} />
    <Card.Content>
      <Card.Header as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.id}`)
                    }>{item.title}</Card.Header>
      <Card.Meta>
        <span className="cinema">{item.category}</span>
      </Card.Meta>
      <Card.Description>{item.description}</Card.Description>
    </Card.Content>
    <Card.Content extra>
      {<Button
                      primary
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                                        </Button>}
                                        {item.discount_price && (
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "olive"
                        }
                      >
                        {item.label}
                      </Label>
                    )}
    </Card.Content>
                                    </Card>
                                    
    </Grid.Column>);
          })}
  </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    refreshCart: () => dispatch(fetchCart())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(ProductList);