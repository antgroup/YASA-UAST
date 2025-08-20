package examples

type DataSelector struct {
	OrderBy    OrderBys
	Filter     Filters
	Pagination Pagination
}

func (d *DataSelector) Parse(db *gorm.DB) *gorm.DB {
	//exps := d.OrderBy.Parse()
	cc := db.Statement
	//for i := range exps {
	//	cc.AddClause(exps[i])
	//}
	//if exps == nil {
	//	db.Order("id desc")
	//}
	//db = db.Offset(d.Pagination.Offset).Limit(d.Pagination.Limit)
	//fexp := d.Filter.Parse()
	//if fexp != nil {
	//	db.Statement.AddClause(clause.Where{Exprs: fexp})
	//}
	return db.Debug()
}
