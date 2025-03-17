"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Box,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Th,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Container,
  Flex,
  Button,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Icon,
  Input,
  Select,
  InputGroup,
  InputLeftElement,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import {
  FaRunning,
  FaBiking,
  FaSwimmer,
  FaWalking,
  FaSearch,
  FaCalendarAlt,
  FaRoute,
  FaClock,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { getActivities } from "../../services/api";
import SleepCard from "@/components/Card/SleepCard";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    getActivities().then((data) => {
      setActivities(data);
      setLoading(false);
    });
  }, []);

  function formatDistance(distance) {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)} m`;
    } else {
      return `${distance.toFixed(2)} km`;
    }
  }

  function formatTime(timeString) {
    if (!timeString) return "N/A";

    if (timeString.includes(".")) {
      timeString = timeString.split(".")[0];
    }

    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return `${minutes}m ${seconds}s`;
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getActivityIcon(type) {
    type = (type || "").toLowerCase();
    if (type.includes("run") || type.includes("jog")) return FaRunning;
    if (type.includes("cycl") || type.includes("bike")) return FaBiking;
    if (type.includes("swim")) return FaSwimmer;
    if (type.includes("walk") || type.includes("hike")) return FaWalking;
    return FaRunning;
  }

  function getActivityColor(type) {
    type = (type || "").toLowerCase();
    if (type.includes("run") || type.includes("jog")) return "green";
    if (type.includes("cycl") || type.includes("bike")) return "blue";
    if (type.includes("swim")) return "cyan";
    if (type.includes("walk") || type.includes("hike")) return "orange";
    return "purple";
  }

  const router = useRouter();

  function handleTableRowClick(activityId) {
    router.push(`/activities/${activityId}`);
  }

  const itemsPerPage = 20;

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      searchTerm === "" ||
      (activity.name &&
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      filterType === "" ||
      (activity.type &&
        activity.type.toLowerCase() === filterType.toLowerCase());

    return matchesSearch && matchesType;
  });

  const totalItems = filteredActivities.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const activityTypes = [
    ...new Set(activities.map((a) => a.type).filter(Boolean)),
  ];

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalDistance = activities.reduce(
    (acc, activity) => acc + (activity.distance || 0),
    0,
  );
  const longestActivity =
    activities.length > 0
      ? activities.reduce((prev, current) =>
          prev.distance > current.distance ? prev : current,
        )
      : null;

  if (loading) {
    return (
      <Container maxW="container.xl" centerContent py={10}>
        <Spinner size="xl" />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={8}>
        <Card mb={6} boxShadow="md">
          <SleepCard />
        </Card>
        <Card mb={6} boxShadow="md">
          <CardHeader color="white" p={4} borderRadius={(4, 0, 0, 4)}>
            <Heading size="md">Activity Summary</Heading>
          </CardHeader>
          <CardBody>
            <StatGroup>
              <Stat>
                <StatLabel fontSize="sm">Total Activities</StatLabel>
                <StatNumber>{activities.length}</StatNumber>
                <StatHelpText>
                  <Icon as={FaCalendarAlt} mr={1} />
                  Lifetime
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel fontSize="sm">Total Distance</StatLabel>
                <StatNumber>{totalDistance.toFixed(2)} km</StatNumber>
                <StatHelpText>
                  <Icon as={FaRoute} mr={1} />
                  All activities
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel fontSize="sm">Longest Activity</StatLabel>
                <StatNumber>
                  {longestActivity
                    ? formatDistance(longestActivity.distance)
                    : "0 km"}
                </StatNumber>
                <StatHelpText>
                  <Icon as={getActivityIcon(longestActivity?.sport)} mr={1} />
                  {longestActivity?.sport || "None"}
                </StatHelpText>
              </Stat>
            </StatGroup>
          </CardBody>
        </Card>

        <Card mb={6} boxShadow="md">
          <CardBody>
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <InputGroup maxW={{ base: "100%", md: "300px" }}>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search activities"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>

              <Select
                placeholder="Filter by type"
                maxW={{ base: "100%", md: "200px" }}
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All types</option>
                {activityTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Flex>
          </CardBody>
        </Card>
      </Box>

      <Card boxShadow="md" mb={6}>
        <CardBody p={0}>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Activity</Th>
                <Th>Type</Th>
                <Th isNumeric>Distance</Th>
                <Th>Duration</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentItems.map((activity) => (
                <Tr
                  key={activity.activity_id}
                  onClick={() => handleTableRowClick(activity.activity_id)}
                  cursor="pointer"
                  _hover={{
                    background: "gray.600",
                    boxShadow: "sm",
                  }}
                  transition="all 0.2s"
                >
                  <Td>{formatDate(activity.start_time)}</Td>
                  <Td fontWeight="medium">
                    {activity.name || "Unnamed Activity"}
                  </Td>
                  <Td>
                    <HStack>
                      <Icon
                        as={getActivityIcon(activity.sport)}
                        color={`${getActivityColor(activity.sport)}.500`}
                      />
                      <Badge colorScheme={getActivityColor(activity.sport)}>
                        {activity.sport || "Unknown"}
                      </Badge>
                    </HStack>
                  </Td>
                  <Td isNumeric>{formatDistance(activity.distance)}</Td>
                  <Td>
                    <Flex align="center">
                      <Icon as={FaClock} mr={2} color="gray.500" />
                      {formatTime(activity.moving_time)}
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Flex justify="space-between" align="center" mb={8}>
        <Text>
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}{" "}
          of {totalItems} activities
        </Text>
        <HStack>
          <Button
            onClick={handlePrevPage}
            isDisabled={currentPage === 1}
            colorScheme="blue"
            variant="filled"
            size="md"
          >
            <Icon as={FaAngleLeft} />
          </Button>
          <Text fontWeight="medium">
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
            colorScheme="blue"
            variant="filled"
            size="md"
          >
            <Icon as={FaAngleRight} />
          </Button>
        </HStack>
      </Flex>
    </Container>
  );
}
