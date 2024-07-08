import styled from 'styled-components';

const sportBaseTabTitles = {
  faSpecialist: 'FA specialistas',
};

const tabs = [
  {
    label: sportBaseTabTitles.faSpecialist,
  },
];

const FaSpecialistPage = () => {
  return (
    <Content>
      <Text>
        Šiuo metu šioje skiltyje papildomos informacijos apie fizinio aktyvumo specialisto veiklą
        nerenkame.
      </Text>
    </Content>
  );
};

const Content = styled.div`
  width: 100%;
  padding: 80px;
  border: 1px solid #e3e8ef;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const Text = styled.div`
  font-size: 1.4rem
  font-weight: 400;
  line-height: 16.94px;
  text-align: center;
  max-width:400px;
  color:#4B5565;
`;

export default FaSpecialistPage;
