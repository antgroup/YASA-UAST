package uast

type Meta struct {
	Type          Type   `json:"type,omitempty"`
	Async         bool   `json:"async,omitempty"`
	Defer         bool   `json:"defer,omitempty"`
	IsRestElement bool   `json:"isRestElement,omitempty"`
	ReceiveCls    string `json:"ReceiveCls"`
	IsInterface   bool   `json:"isInterface,omitempty"`
}
