import { Card, Text, Button, Box, InlineStack, BlockStack, Page } from "@shopify/polaris";
import { useAppBridge } from "../components/createContext/AppBridgeContext";
import { Redirect } from "@shopify/app-bridge/actions";
import { useMemo,useEffect ,useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDetails } from '../components/Redux/slices/adminSlice';



export default function AccountInformation() {
    const dispatch = useDispatch();
    const app = useAppBridge();
    const [adminIdLocal, setAdminIdLocal] = useState(null);
    const { adminDetails_, loading: adminDetailsLoading } = useSelector((state) => state.admin);

    useEffect(() => {
        const id = localStorage.getItem('domain_V_id');
        setAdminIdLocal(id);
    }, []);
    console.log("adminIdLocal",adminIdLocal)
    const redirect = useMemo(() => {
        if (!app) return null;
        return Redirect.create(app);
    }, [app]);

    useEffect(()=> {
        if(adminIdLocal){
            dispatch(fetchAdminDetails(adminIdLocal,app))
        }
    },[adminIdLocal])

    console.log("adminDetails_",adminDetails_)

    return (
        <Page
            title="Account Information"
            primaryAction={{
                content: 'View Pricing',
                onAction: () => {
                    if (!redirect) return;
                    redirect.dispatch(Redirect.Action.REMOTE, "https://admin.shopify.com/store/rohit-12345839/charges/label-node01/pricing_plans");
                },
            }}
        >
            <Card>
                
                <Box>
                    <BlockStack gap="300">
                        <InlineStack align="space-between">
                            <Text>Plan Name</Text>
                            <Text fontWeight="bold">Basic</Text>
                        </InlineStack>

                        <InlineStack align="space-between">
                            <Text>Plan Type</Text>
                            <Text fontWeight="bold">Monthly</Text>
                        </InlineStack>

                        <InlineStack align="space-between">
                            <Text>Remaining Calls</Text>
                            <Text fontWeight="bold">49955</Text>
                        </InlineStack>

                        <InlineStack align="space-between">
                            <Text>Total Plan Calls</Text>
                            <Text fontWeight="bold">1000</Text>
                        </InlineStack>
                    </BlockStack>
                </Box>
            </Card>
        </Page>
    );
}