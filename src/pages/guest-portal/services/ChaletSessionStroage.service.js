import SessionStorageService from "../../../services/SessionStorageService.service";


const ChaletSessionStroage = (
    () => {
        let instance;

        class ChaletSessionStroageClass {
            constructor() {
                this.prefix = "chalet_";
                this.PAGE_NUMBER = "current_page";
                this.FILTERS = "filters";
                this.SCROLL_POSITION = "scroll_position"
                this._SessionStorage = new SessionStorageService(this.prefix)
            }

            saveFilters(filtersData) {
                try {
                    if (filtersData && Object.keys(filtersData).length > 0) {
                        const hasActiveFilters = Object.values(filtersData).some(value =>
                            value !== '' && value !== null && value !== undefined
                        );
                        if (hasActiveFilters) {
                            this._SessionStorage.set(this.FILTERS, JSON.stringify(filtersData));
                        }
                    }
                } catch (error) {
                    console.error('Error saving filters to session storage:', error);
                }
            };

            
            saveAll = (filtersData, currentPage, scrollPosition = null) => {
                try {
                    if (filtersData && Object.keys(filtersData).length > 0) {
                        const hasActiveFilters = Object.values(filtersData).some(value =>
                            value !== '' && value !== null && value !== undefined
                        );
                        if (hasActiveFilters) {
                            this._SessionStorage.set(this.FILTERS, JSON.stringify(filtersData));
                        } else {
                            this._SessionStorage.remove(this.FILTERS);
                        }
                    }
                    
                    if (currentPage > 1) {
                        this._SessionStorage.set(this.PAGE_NUMBER, currentPage.toString());
                    } else {
                        this._SessionStorage.remove(this.PAGE_NUMBER);
                    }
                    
                    if (scrollPosition !== null) {
                        this._SessionStorage.set(this.SCROLL_POSITION, scrollPosition.toString());
                    }
                } catch (error) {
                    console.error('Error saving to session storage:', error);
                }
            };
            
            loadAll = () => {
                try {
                    const savedFilters = this._SessionStorage.get(this.FILTERS);
                    const savedPage = this._SessionStorage.get(this.PAGE_NUMBER);
                    const savedScrollPosition = this._SessionStorage.get(this.SCROLL_POSITION);
                    
                    return {
                        filters: savedFilters ? JSON.parse(savedFilters) : {},
                        page: savedPage ? parseInt(savedPage, 10) : 1,
                        scrollPosition: savedScrollPosition ? parseInt(savedScrollPosition, 10) : 0
                    };
                } catch (error) {
                    console.error('Error isLoading from session storage:', error);
                    return { filters: {}, page: 1, scrollPosition: 0 };
                }
            };
            
            saveScrollPosition(scrollPosition) {
                try {
                    this._SessionStorage.set(this.SCROLL_POSITION, scrollPosition.toString());
                } catch (error) {
                    console.error('Error saving filters to session storage:', error);
                }
            };

            removeScrollPostion(){
                try {
                    this._SessionStorage.remove(this.SCROLL_POSITION);
                } catch (error) {
                    console.error('Error saving filters to session storage:', error);
                }
            }

            clear() {
                try {
                    this._SessionStorage.clear();
                } catch (error) {
                    console.error('Error clearing session storage:', error);
                }
            };
        }

        return {
            getInstance: () => {
                if (instance) return instance;

                return instance = new ChaletSessionStroageClass();
            }
        }
    }
)()

export default ChaletSessionStroage.getInstance;