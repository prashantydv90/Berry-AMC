import { NavLink, Outlet } from "react-router-dom";
import { NavBar } from "../NavBar";
import Footer from "../Footer";

export const Market = () => {
    return (
        <>
            <NavBar />
            <div className=" min-h-screen px-3 md:px-12 2xl:px-25 3xl:px-45 pt-25 pb-15 md:pb-18 bg-[#F8FAFC]">
                {/* <h1 className="text-3xl font-bold mb-6">Market</h1> */}

                {/* Tabs */}
                <div className="mb-8">
                    <div className="inline-flex rounded-xl bg-white p-1 shadow-sm border border-zinc-200">
                        <NavLink
                            to="buyback"
                            className={({ isActive }) =>
                                `
        px-5 py-2 text-sm text-center md:text-base font-medium rounded-lg transition-all
        ${isActive
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                }
        `
                            }
                        >
                            Buyback
                        </NavLink>

                        <NavLink
                            to="ipo"
                            className={({ isActive }) =>
                                `
        px-5 py-2 text-sm md:text-base font-medium rounded-lg transition-all
        ${isActive
                                    ? "bg-blue-600 text-white shadow"
                                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                }
        `
                            }
                        >
                            IPO
                        </NavLink>
                    </div>
                </div>


                {/* Section content */}
                <Outlet />
            </div>

            <Footer/>
        </>
    );
};


