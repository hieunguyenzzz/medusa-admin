import { useAdminStore } from "medusa-react"
import React, { useState } from "react"
import CashIcon from "../../fundamentals/icons/cash-icon"
import CustomerIcon from "../../fundamentals/icons/customer-icon"
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon"
import GearIcon from "../../fundamentals/icons/gear-icon"
import GiftIcon from "../../fundamentals/icons/gift-icon"
import SaleIcon from "../../fundamentals/icons/sale-icon"
import TagIcon from "../../fundamentals/icons/tag-icon"
import SidebarCompanyLogo from "../../molecules/sidebar-company-logo"
import SidebarMenuItem from "../../molecules/sidebar-menu-item"

const ICON_SIZE = 18

const Sidebar: React.FC = () => {
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)

  const { store } = useAdminStore()

  const triggerHandler = () => {
    const id = triggerHandler.id++
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    }
  }
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0

  return (
    <div className="h-screen overflow-y-auto border-r min-w-sidebar max-w-sidebar bg-gray-0 border-grey-20 py-base px-base">
      <div className="h-full divide-y">
        <SidebarCompanyLogo storeName={store?.name} />

        <div className="py-3.5 border-grey-20">
          <SidebarMenuItem
            pageLink={"/a/orders"}
            icon={<DollarSignIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Orders"}
            subItems={[
              {
                pageLink: "/a/checkouts/",
                text: "Abandoned checkouts",
              },
            ]}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<TagIcon size={ICON_SIZE} />}
            text={"Products"}
            triggerHandler={triggerHandler}
          />
          <SidebarMenuItem
            pageLink={"/a/customers"}
            icon={<CustomerIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Customers"}
          />
          <SidebarMenuItem
            pageLink={"/a/discounts"}
            icon={<SaleIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Discounts"}
          />
          <SidebarMenuItem
            pageLink={"/a/gift-cards"}
            icon={<GiftIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Gift Cards"}
          />
          <SidebarMenuItem
            pageLink={"/a/pricing"}
            icon={<CashIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Pricing"}
          />
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<GearIcon size={ICON_SIZE} />}
            triggerHandler={triggerHandler}
            text={"Settings"}
          />
        </div>
        <div className="py-3.5 border-grey-20">
          <a
            target={"_blank"}
            className="py-1.5 px-3 my-0.5 rounded-base flex text-grey-90 hover:bg-grey-10 items-center"
            href="https://medusa.designereditions.com/admin/index.html#/~"
          >
            <span className="items-start">
              <svg
                width="18"
                height={18}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.971 1.545A1 1 0 013.861 1h12.277a1 1 0 01.89.545l1.669 3.128c.03.062.063.138.094.224.09.228.153.47.185.722.015.098.024.189.024.263V6a2.992 2.992 0 01-1.092 2.315A2.988 2.988 0 0116 9c-.617 0-1.19-.186-1.666-.505A2.997 2.997 0 0113 6v.02A2.997 2.997 0 0110 9a2.986 2.986 0 01-1.677-.512A2.997 2.997 0 017 6.019 2.997 2.997 0 014 9c-.768 0-1.47-.289-2-.764C1.386 7.686 1 6.888 1 6v-.118c0-.063.007-.137.019-.218.049-.443.194-.856.415-1.219l1.537-2.9zM18 17.5v-6.916A4.983 4.983 0 0116 11a4.978 4.978 0 01-3-1c-.836.628-1.874 1-3 1a4.978 4.978 0 01-3-1c-.836.628-1.874 1-3 1a4.983 4.983 0 01-2-.416V17.5A1.5 1.5 0 003.5 19h2A1.5 1.5 0 007 17.5v-3A1.5 1.5 0 018.5 13h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 001.5 1.5h2a1.5 1.5 0 001.5-1.5z" />
              </svg>
            </span>
            <span className="ml-3">Storefront Settings</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
