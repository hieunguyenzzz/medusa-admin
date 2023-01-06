import clsx from "clsx"
import moment from "moment"
import { useLayoutEffect, useMemo, useState } from "react"
import { Route, Routes, useNavigate, useParams } from "react-router-dom"
import { usePagination, useTable } from "react-table"
import Spinner from "../../components/atoms/spinner"
import Tooltip from "../../components/atoms/tooltip"
import ClipboardCopyIcon from "../../components/fundamentals/icons/clipboard-copy-icon"
import RefreshIcon from "../../components/fundamentals/icons/refresh-icon"
import Modal from "../../components/molecules/modal"
import Table from "../../components/molecules/table"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import TableContainer from "../../components/organisms/table-container"
import Medusa from "../../services/api"
import OrderLine from "./details/order-line"
import { DisplayTotal } from "./details/templates"
const VIEWS = ["Abandoned Checkouts"]
let cachedata = []
const AbadonedCartsTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Index",
        accessor: "index",
        Cell: ({ cell: { value } }) => <div>{value}</div>,
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: "Customer",
        accessor: "customer_id",
        Cell: ({ row, cell: { value } }) => <div>{value}</div>,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ row, cell: { value } }) => <div>{value}</div>,
      },
    ],
    []
  )
  let count = data?.length || 0
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: data || [],
      manualPagination: true,
      initialState: {
        pageSize: 20,
        pageIndex: 1,
      },
      pageCount: Math.max(1, Math.floor(count / 20)),
      autoResetPage: false,
    },
    usePagination
  )
  let isLoading = Boolean(!data)
  const queryObject = {
    offset: 0,
  }
  const handleNext = () => {
    if (canNextPage) {
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      previousPage()
    }
  }
  return (
    <TableContainer
      isLoading={isLoading}
      hasPagination
      numberOfRows={20}
      pagingState={{
        count,
        offset: queryObject.offset,
        pageSize: pageIndex * queryObject.offset + 20,
        title: "Abadoned carts",
        currentPage: pageIndex + 1,
        pageCount: pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: canNextPage,
        hasPrev: canPreviousPage,
      }}
    >
      <Table {...getTableProps()} className={clsx({ ["relative"]: isLoading })}>
        <Table.Head>
          {headerGroups?.map((headerGroup) => (
            <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((col) => (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              ))}
            </Table.HeadRow>
          ))}
        </Table.Head>
        <Table.Body {...getTableBodyProps()}>
          {rows
            .filter((_, index) => {
              if (Math.floor(index / 20) === pageIndex) {
                return true
              }
              return false
            })
            .map((row) => {
              prepareRow(row)
              return (
                <Table.Row
                  color={"inherit"}
                  linkTo={row.original.id}
                  {...row.getRowProps()}
                  className="group"
                >
                  {row.cells.map((cell) => {
                    return (
                      <Table.Cell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}
const filter = (item) => Boolean(item.email)
const OrderIndex = () => {
  const view = "Abandoned Checkouts"
  const [data, setData] = useState(cachedata)
  useLayoutEffect(() => {
    Medusa.abadonedCarts.list().then((res) => {
      cachedata = res.data.filter(filter)
      setData(cachedata)
    })
  }, [])
  const navigate = useNavigate()
  console.log({ data })
  return (
    <>
      <div className="flex flex-col h-full grow">
        <div className="flex flex-col w-full grow">
          <BodyCard
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={(v) => {
                  if (v === "drafts") {
                    navigate(`/a/checkouts`)
                  }
                }}
                activeView={view}
              />
            }
            actionables={[
              {
                label: "Refresh",
                icon: <RefreshIcon />,
                disabled: !data,
                onClick() {
                  setData(null)
                  Medusa.abadonedCarts.list().then((res) => {
                    cachedata = res.data.filter(filter)
                    setData(cachedata)
                  })
                },
              },
            ]}
            className="h-fit"
          >
            <AbadonedCartsTable {...{ data }} />
          </BodyCard>
        </div>
      </div>
    </>
  )
}
const DetailsModal = ({ handleCancel }) => {
  const { id } = useParams()
  const [data, setData] = useState()
  useLayoutEffect(() => {
    Medusa.abadonedCarts.retrieve(id).then((res) => {
      setData(res.data)
    })
  }, [id])
  console.log("item", data)
  let items = data?.lineItems || []
  let total = items.reduce((result, item) => {
    result = result + item.quantity * item.unit_price
    return result
  }, 0)
  let currencyCode = "GBP"
  return (
    <Modal handleClose={handleCancel} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={handleCancel}>
          <Tooltip side="top" content={"Copy ID"}>
            <button className="flex items-center cursor-pointer inter-xlarge-semibold text-grey-90 active:text-violet-90 gap-x-2">
              #{id} <ClipboardCopyIcon size={16} />
            </button>
          </Tooltip>
        </Modal.Header>
        <Modal.Content>
          {!data ? (
            <BodyCard className="flex items-center justify-center w-full pt-2xlarge">
              <Spinner size={"large"} variant={"secondary"} />
            </BodyCard>
          ) : (
            <div className="flex flex-col">
              <BodyCard
                className={"w-full mb-4 min-h-0 h-auto"}
                title="Summary"
              >
                <div className="mt-6">
                  {data?.lineItems?.map((item, i) => (
                    <OrderLine
                      key={i}
                      item={item}
                      currencyCode={currencyCode}
                    />
                  ))}
                  <DisplayTotal
                    currency={currencyCode}
                    totalAmount={total}
                    totalTitle={"Total"}
                  />
                </div>
              </BodyCard>
            </div>
          )}
        </Modal.Content>
      </Modal.Body>
    </Modal>
  )
}
const Checkouts = () => {
  const navigate = useNavigate()
  return (
    <div>
      <OrderIndex />
      <Routes>
        <Route
          path="/:id"
          element={<DetailsModal handleCancel={() => navigate(-1)} />}
        />
      </Routes>
    </div>
  )
}

export default Checkouts
