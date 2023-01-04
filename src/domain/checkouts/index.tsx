import { Route, Routes, useNavigate } from "react-router-dom"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import OrderTable from "../../components/templates/order-table"
import Details from "./details"

const VIEWS = ["Abandoned Checkouts"]

const OrderIndex = () => {
  const view = "Abandoned Checkouts"

  const navigate = useNavigate()

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
            className="h-fit"
          >
            <OrderTable />
          </BodyCard>
        </div>
      </div>
    </>
  )
}

const Checkouts = () => {
  return (
    <Routes>
      <Route index element={<OrderIndex />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default Checkouts
