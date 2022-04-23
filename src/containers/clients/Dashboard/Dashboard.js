import { Route, Routes } from "react-router-dom";
import { createUseStyles } from 'react-jss';
import { Layout } from 'antd';
import { useNavigate } from "react-router-dom";
import ClientList from './../../clients/ClientList/ClientList';
import ClientForm from './../../clients/ClientForm/ClientForm';
import Client from './../../clients/Client/Client';
import Style from "./Style";

const useStyles = createUseStyles(Style);

const { Header, Content } = Layout;

function Dashboard() {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <Layout style={{height: "100vh"}}>
            <Header className={classes.header}>
                <span className={classes.title} onClick={() => navigate('/')}>GARRA</span>
            </Header>
            <Layout>
                <Content className={classes.container}>
                    <Routes>
                        <Route path="/" element={<ClientList/>} />
                        <Route path="/new" element={<ClientForm/>} />
                        <Route path="/:id" element={<Client/>} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default Dashboard;
