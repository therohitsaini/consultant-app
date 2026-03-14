import {
  Banner,
  Layout,
  Page,
  BlockStack,
  Grid,
  LegacyCard,
  Text,
  ButtonGroup,
  Button,
  Thumbnail,
  Spinner,
  InlineStack,
  Box,
} from "@shopify/polaris";
import {
  ConfettiIcon,
  ExternalIcon,
  PlusIcon,
  EditIcon,
  DuplicateIcon,
  DeleteIcon,
} from "@shopify/polaris-icons";
import { useEffect, useState, useCallback, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import IndexTableList from "../components/consultant-list/IndexTableList";
import { IndexTable } from "@shopify/polaris";
import {
  deleteConsultantById,
  fetchConsultants,
} from "../components/Redux/slices/ConsultantSlices";
import { useDispatch, useSelector } from "react-redux";
import { UserAlert } from "../components/AlertModel/UserAlert";
import { headings, itemStrings } from "../components/FallbackData/FallbackData";
import axios from "axios";
import { useAppBridge } from "../components/createContext/AppBridgeContext";
import { Redirect } from "@shopify/app-bridge/actions";
import { fetchAdminDetails } from "../components/Redux/slices/adminSlice";
import { usePolarisToast } from "../components/AlertModel/PolariesTostContext";

function ConsultantList() {
  const app = useAppBridge();
  const dispatch = useDispatch();

  const redirect = useMemo(() => {
    if (!app) return null;
    return Redirect.create(app);
  }, [app]);

  const goToAddConsultant = () => {
    if (!redirect) return;
    redirect.dispatch(Redirect.Action.APP, "/consultant-list/add-consultant");
  };
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [queryValue, setQueryValue] = useState("");
  const [sortValue, setSortValue] = useState(["name asc"]);
  const [isUserAlertVisible, setIsUserAlertVisible] = useState(false);
  const [consultantId, setConsultantId] = useState(null);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [adminIdLocal, setAdminIdLocal] = useState(null);
  const { showToast } = usePolarisToast();
  const { consultants, loading: consultantLoading } = useSelector(
    (state) => state.consultants,
  );
  const { adminDetails_, loading: adminDetailsLoading } = useSelector(
    (state) => state.admin,
  );
  console.log("consultants", consultants);

  useEffect(() => {
    const id = localStorage.getItem("domain_V_id");
    setAdminIdLocal(id);
  }, []);

  useEffect(() => {
    if (!adminIdLocal) return;
    dispatch(fetchConsultants({ adminIdLocal, app }));
  }, [dispatch, isRefreshed, adminIdLocal, app]);

  const consultantsData = consultants?.findConsultant || [];
  const filteredConsultants = useMemo(() => {
    if (!consultantsData) return [];

    return consultantsData.filter((consultant) => {
      let matchesTab = true;
      if (selectedTab !== 0) {
        const selectedTabLabel = itemStrings[selectedTab].toLowerCase();
        matchesTab = consultant.type?.toLowerCase() === selectedTabLabel;
      }
      let matchesQuery = true;
      if (queryValue.trim()) {
        const query = queryValue.toLowerCase();
        matchesQuery =
          consultant.name?.toLowerCase().includes(query) ||
          consultant.email?.toLowerCase().includes(query) ||
          consultant.contact?.toLowerCase().includes(query) ||
          consultant.phone?.toLowerCase().includes(query) ||
          consultant.profession?.toLowerCase().includes(query);
      }

      return matchesTab && matchesQuery;
    });
  }, [consultantsData, selectedTab, queryValue, itemStrings]);

  const sortedConsultants = useMemo(() => {
    if (!filteredConsultants.length || !sortValue[0])
      return filteredConsultants;

    const [field, direction] = sortValue[0].split(" ");
    const sorted = [...filteredConsultants];

    sorted.sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      if (field === "experience" || field === "conversionFees") {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }
      if (direction === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return sorted;
  }, [filteredConsultants, sortValue]);

  const handleConsultantClick = useCallback((_id) => {
    console.log("consultant _id", _id);
  }, []);

  const handleEdit = useCallback(
    (_id) => {
      navigate(`/consultant-list/add-consultant?id=${_id}`);
    },
    [navigate],
  );

  // Handle delete confirmation
  const handleDeleteClick = useCallback((_id) => {
    setConsultantId(_id);
    setIsUserAlertVisible(true);
  }, []);

  useEffect(() => {
    if (adminIdLocal) {
      dispatch(fetchAdminDetails({ adminIdLocal, app }));
    }
  }, [adminIdLocal, app]);
  console.log("adminDetails_", adminDetails_);

  const handleToggle = async (id) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/api-consultant-update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === 200) {
        showToast(response.data?.message);
        dispatch(fetchConsultants({ adminIdLocal, app }));
        setIsRefreshed((prev) => !prev);
      }
    } catch (err) {
      console.error("Failed to update");
    }
  };

  const handleDelete = async () => {
    try {
      const url = `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/delete-consultant/${consultantId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        setIsUserAlertVisible(false);
        setIsRefreshed((prev) => !prev);
      } else {
        console.log("Failed to delete consultant");
      }
    } catch (error) {
      console.error("Error deleting consultant:", error);
    }
  };

  const renderConsultantRow = useCallback(
    (consultant, index) => {
      const {
        _id,
        fullname,
        profession,
        experience,
        chatPerMinute,
        consultantStatus,
        voicePerMinute,
        videoPerMinute,
      } = consultant;

      return (
        <IndexTable.Row _id={_id} key={_id} position={index}>
          <IndexTable.Cell alignment="start">
            <Text
              as="span"
              alignment="start"
              variant="bodyMd"
              fontWeight="bold"
              numeric
            >
              {index + 1}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell alignment="center">
            <InlineStack align="center">
              <div
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              >
                <Thumbnail
                  source={
                    consultant?.profileImage
                      ? consultant.profileImage.replace(/\\/g, "/")
                      : "/images/flag/teamdefault.png"
                  }
                  size="large"
                />
              </div>
            </InlineStack>
          </IndexTable.Cell>
          <IndexTable.Cell alignment="center">
            <Text variant="bodyMd" as="span" alignment="center">
              {fullname}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text variant="bodyMd" as="span" alignment="center">
              {profession}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" alignment="center" numeric>
              <Text variant="bodyMd" as="span" alignment="center">
                {adminDetails_?.currency}
                {chatPerMinute || "-"}
              </Text>
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" alignment="center" numeric>
              <Text variant="bodyMd" as="span" alignment="center">
                {adminDetails_?.currency}
                {voicePerMinute || "-"}
              </Text>
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span" alignment="center" numeric>
              <Text variant="bodyMd" as="span" alignment="center">
                {adminDetails_?.currency}
                {videoPerMinute || "-"}
              </Text>
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <label
              onClick={() => handleToggle(_id)}
              style={{
                position: "relative",
                display: "flex",
                margin: "auto",
                width: "36px",
                height: "20px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={consultantStatus}
                onChange={() => {
                  console.log("Clicked ID:", _id);
                }}
                style={{
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: consultantStatus
                    ? "var(--p-color-bg-fill-brand)"
                    : "var(--p-color-bg-fill-selected)",
                  borderRadius: "11px",
                  transition: "background-color 0.2s ease",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "16px",
                    width: "16px",
                    left: consultantStatus ? "18px" : "2px",
                    top: "2px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "50%",
                    transition: "left 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </span>
            </label>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack align="center" gap="100">
              <Button
                variant="tertiary"
                icon={EditIcon}
                accessibilityLabel="Edit consultant"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit(_id);
                }}
              />
              <Button
                variant="tertiary"
                icon={DeleteIcon}
                tone="critical"
                accessibilityLabel="Delete consultant"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(_id);
                }}
              />
            </InlineStack>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    },
    [
      handleConsultantClick,
      handleEdit,
      handleDeleteClick,
      isRefreshed,
      adminDetails_?.currency,
    ],
  );

  return (
    <Fragment>
      <UserAlert
        isUserAlertVisible={isUserAlertVisible}
        setIsUserAlertVisible={setIsUserAlertVisible}
        handleDelete={handleDelete}
        consultantId={consultantId}
      />
      <Box paddingBlockStart="400">
        <Page
          title="Consultant List"
          primaryAction={{
            icon: PlusIcon,
            content: "Add Consultant",
            onAction: goToAddConsultant,
          }}
        >
          <Layout>
            <Layout.Section>
              <IndexTableList
                loading={consultantLoading}
                itemStrings={itemStrings}
                sortOptions={[]}
                data={sortedConsultants}
                headings={headings}
                renderRow={renderConsultantRow}
                resourceName={{ singular: "consultant", plural: "consultants" }}
                queryPlaceholder="Search consultants"
                onTabChange={setSelectedTab}
                onQueryChange={setQueryValue}
                onSortChange={setSortValue}
              />
            </Layout.Section>
          </Layout>
        </Page>
      </Box>
    </Fragment>
  );
}

export default ConsultantList;
