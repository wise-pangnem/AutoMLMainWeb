import React, {useEffect, useReducer, useState} from 'react';
import {createMetadata, getMetadatas} from "../../../api/metadata";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Modal,
  styled,
  TextField
} from "@mui/material";

import {
  CATEGORY_THEME_MAP,
  COLUMNS,
  CREATOR_CONTACT_POINT_NAME_MAP,
  DEFAULT_PAGE_COUNT,
  DISPLAY_COUNT,
  LICENSE_RIGHTS_MAP,
  TYPES
} from "./constants";
import {DataGrid} from "@mui/x-data-grid";
import {getPreSignedUrl} from "../../../api/url";
import {uploadFileToS3} from "../../../api/file-storage/s3";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {scrap} from "../../../api/scrap/scrap";
import DataSetSelect from "./DataSetSelect";
import DataInfoContentText from "./DataInfoContentText";
import DataSetTextField from "./DataSetTextField";
import CatalogReducer from "./reducers/CatalogReducer";
import DataSetReducer from "./reducers/DataSetReducer";
import DistributionReducer from "./reducers/DistributionReducer";

export const INIT_CATALOG_ARGS = {
  themes: [],
};

export const INIT_DATASET_ARGS = {
  contactPointNames: [],
  rightses: [],
};

export const INIT_DISTRIBUTION_ARGS = {};

const Input = styled('input')({});

const centerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default function MetadataManagementContent() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(DEFAULT_PAGE_COUNT);

  const [inputLinkDialogOpen, setInputLinkDialogOpen] = useState(false);
  const [inputDataInfoDialogOpen, setInputDataInfoDialogOpen] = useState(false);

  const [progressBarOpend, setProgressBarOpend] = useState(false);
  const [fileUploadPercent, setFileUploadPercent] = useState(0);

  useEffect(() => {
    getMetadatas(DEFAULT_PAGE_COUNT, DISPLAY_COUNT)
      .then(it => {
        setData(it)
        setPage(DEFAULT_PAGE_COUNT)
      })
    // .catch(() => alert("???????????? ?????????????????? ?????????????????????."));
  }, [])

  const [catalogState, dispatchCatalog] = useReducer(CatalogReducer, INIT_CATALOG_ARGS)

  function onChangeCatalog(event) {
    dispatchCatalog({
      payload: event.target
    });
  }

  const [dataSetState, dispatchDataSet] = useReducer(DataSetReducer, INIT_DATASET_ARGS)

  function onChangeDataSet(event) {
    dispatchDataSet({
      payload: event.target
    });
  }

  const [distributionState, dispatchDistribution] = useReducer(DistributionReducer, INIT_DISTRIBUTION_ARGS)

  function onChangeDistribution(event) {
    dispatchDistribution({
      payload: event.target
    });
  }

  const totalDisplayedRowCount = (page + 1) * DISPLAY_COUNT;

  return (
    <>
      <Button variant="outlined" sx={{
        marginBottom: 2,
      }} onClick={() => setInputLinkDialogOpen(true)}>
        ?????????
      </Button>
      <Dialog open={inputLinkDialogOpen} onClose={closeInputLinkDialog}>
        <DialogTitle>?????? ??????</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ???????????? ???????????? ????????? ?????? ??????????????????.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="sourceUrl"
            label="???????????? URL"
            fullWidth
            variant="standard"
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={setSourceUrlState}
                />
              }
              label="?????? ??????"/>
          </FormGroup>

        </DialogContent>
        <DialogActions>
          <Button onClick={closeInputLinkDialog}>??????</Button>
          <Button onClick={handleInputLinkDialogNext}>??????</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={inputDataInfoDialogOpen} onClose={closeDataInfoDialog}>
        <DialogTitle>????????? ?????? ??????</DialogTitle>
        <DialogContent>

          <DataInfoContentText name="????????????"/>
          <DataSetSelect
            name={{eng: 'category', kor: '????????????'}}
            onChange={onChangeCatalog}
            list={Object.keys(CATEGORY_THEME_MAP)}
          />
          <DataSetSelect
            name={{eng: 'theme', kor: '??????'}}
            onChange={onChangeCatalog}
            list={catalogState.themes}
          />
          <DataSetTextField
            name={{eng: 'themeTaxonomy', kor: '?????? ??????'}}
            onChange={onChangeCatalog}
          />

          <DataInfoContentText name="????????????"/>
          <DataSetTextField
            name={{eng: 'title', kor: '??????'}}
            value={dataSetState.title}
            onChange={onChangeDataSet}
          />
          <DataSetTextField
            name={{eng: 'publisher', kor: '?????? ??????'}}
            value={dataSetState.publisher}
            onChange={onChangeDataSet}
          />
          <DataSetSelect
            name={{eng: 'creator', kor: '?????? ??????'}}
            onChange={onChangeDataSet}
            list={Object.keys(CREATOR_CONTACT_POINT_NAME_MAP)}
          />
          <DataSetSelect
            name={{eng: 'contactPointName', kor: '????????? ??????'}}
            onChange={onChangeDataSet}
            list={dataSetState.contactPointNames}
          />
          <DataSetSelect
            name={{eng: 'type', kor: '??????'}}
            onChange={onChangeDataSet}
            list={TYPES}
          />
          <DataSetTextField
            name={{eng: 'keyword', kor: '?????????'}}
            value={dataSetState.keyword}
            onChange={onChangeDataSet}
          />
          <DataSetSelect
            name={{eng: 'license', kor: '????????????'}}
            onChange={onChangeDataSet}
            list={Object.keys(LICENSE_RIGHTS_MAP)}
          />
          <DataSetSelect
            name={{eng: 'rights', kor: '??????'}}
            onChange={onChangeDataSet}
            list={dataSetState.rightses}
          />
          <DataSetTextField
            name={{eng: 'description', kor: '??????'}}
            value={dataSetState.description}
            onChange={onChangeDataSet}
          />

          <DataInfoContentText name="??????"/>
          <TextField
            id="distribution-title-text-field"
            label="??????"
            variant="filled"
            fullWidth
            disabled
            value="?????? ????????? ??? ???????????? ???????????????"
          />
          <DataSetTextField
            name={{eng: 'description', kor: '??????'}}
            onChange={onChangeDistribution}
          />

          <TextField
            id="downloadUrl-text-field"
            label="???????????? URL"
            variant="filled"
            fullWidth
            disabled
            value="?????? ????????? ??? ???????????? ???????????????"
          />

          <DataSetTextField
            name={{eng: 'temporalResolution', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
          />

          <DataSetTextField
            name={{eng: 'accurualPeriodicity', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
          />
          <DataSetTextField
            name={{eng: 'spatial', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
          />
          <DataSetTextField
            name={{eng: 'temporal', kor: '?????? ??????'}}
            onChange={onChangeDistribution}
          />

          <label htmlFor="file">
            <Input
              accept=".csv"
              id="file"
              type="file"
              onChange={onChangeDistribution}
            />
          </label>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDataInfoDialogPrevious}>????????????</Button>
          <Button onClick={closeDataInfoDialog}>??????</Button>
          <Button onClick={handleFinish}>??????</Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={progressBarOpend}
        onClose={!progressBarOpend}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          ...centerStyle,
        }}
      >
        <Box sx={{
          backgroundColor: 'white',
          ...centerStyle
        }}>
          <CircularProgress variant="determinate" value={fileUploadPercent}/>
          <Box
            sx={{
              position: 'absolute',
              ...centerStyle,
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {fileUploadPercent}%
            </Typography>
          </Box>
        </Box>
      </Modal>


      <DataGrid
        rows={parseToRows(data)}
        rowCount={totalDisplayedRowCount + 1} // ?????? ???????????? ????????? ??? ?????? ?????? ??? ??????
        columns={COLUMNS}
        page={page}
        pageSize={DISPLAY_COUNT}
        rowsPerPageOptions={[DISPLAY_COUNT]}
        // checkboxSelection
        // disableSelectionOnClick
        paginationMode="server" // ???????????? ????????????????????? ??????????????? ?????? ??????
        onPageChange={newPage => {
          getMetadatas(newPage, DISPLAY_COUNT)
            .then(data => {
              setData(data)
              setPage(newPage)
            })
        }}
        initialState={{
          pagination: {
            page: DEFAULT_PAGE_COUNT
          }
        }}
      />
    </>
  );

  /**
   * data grid?????? row??? ?????? ??? ????????? ???????????????.
   */
  function parseToRows(metadatas) {
    return metadatas.map(metadata => {
      return {
        ...metadata.catalog,
        ...metadata.dataSet,
        ...metadata.dataSet.organization,
        ...metadata.dataSet.organization.contactPoint,
        ...metadata.dataSet.licenseInfo,
        ...metadata.distribution,

        // dataSet??? distribution??? title??? description??? ???????????? ???????????? ??????
        dataSetTitle: metadata.dataSet.title,
        dataSetDescription: metadata.dataSet.description,
        distributionTitle: metadata.distribution.title,
        distributionDescription: metadata.distribution.description,
      }
    });
  }

  async function handleInputLinkDialogNext() {
    const url = document.getElementById("sourceUrl").value;

    const result = await scrap(url);

    if (result !== undefined) {
      [dispatchDataSet, dispatchDistribution].forEach(it => it({
        type: 'data.go.kr',
        payload: result
      }))
    }

    closeInputLinkDialog();
    setInputDataInfoDialogOpen(true);
  }

  function closeInputLinkDialog() {
    setInputLinkDialogOpen(false);
  }

  function setSourceUrlState() {
    const sourceUrl = document.getElementById("sourceUrl")
    const disabled = sourceUrl.getAttribute("disabled");

    if (disabled === null) {
      sourceUrl.setAttribute("disabled", "")
      sourceUrl.value = "";
    } else {
      sourceUrl.removeAttribute("disabled");
    }

  }

  function closeDataInfoDialog() {
    setInputDataInfoDialogOpen(false);

    clearAllStates();
  }

  function handleDataInfoDialogPrevious() {
    setInputDataInfoDialogOpen(false);
    clearAllStates();

    setInputLinkDialogOpen(true);
  }

  function clearAllStates() {
    [dispatchCatalog, dispatchDataSet, dispatchDistribution].forEach(it => {
      it({
        type: "clear"
      })
    })
  }

  async function handleFinish() {
    const file = document.getElementById("file").files[0];
    if (file === undefined) {
      alert("????????? ????????? ????????????.");
      return;
    }

    const preSignedUrl = await getPreSignedUrl(file.name);
    const downloadUrl = preSignedUrl.split("?")[0];

    const createMetadataAttributes = {
      catalog: {
        categoryName: catalogState.category,
        themeName: catalogState.theme,
        themeTaxonomy: catalogState.themeTaxonomy
      },
      dataset: {
        creator: dataSetState.creator,
        contactPointName: dataSetState.contactPointName,
        type: dataSetState.type,
        title: dataSetState.title,
        publisher: dataSetState.publisher,
        keyword: dataSetState.keyword,
        license: dataSetState.license,
        rights: dataSetState.rights,
        description: dataSetState.description,
      },
      distribution: {
        title: file.name,
        description: distributionState.description,
        temporalResolution: distributionState.temporalResolution,
        accurualPeriodicity: distributionState.accurualPeriodicity,
        spatial: distributionState.spatial,
        temporal: distributionState.temporal,
        downloadUrl: downloadUrl
      }
    }

    createMetadata(createMetadataAttributes)
      .then(async () => {
        displayProgressBar();
        await uploadFileToS3(preSignedUrl, file, setFileUploadPercent)
      })
      .then(() => {
        closeProgressBar();
        alert("?????? ??????")
        window.location.reload();
      })
      .catch(err => {
        if (err.response.data.errors) {
          alert(err.response.data.errors[0].defaultMessage);
          return;
        }

        if (err.response.data.message) {
          alert(err.response.data.message);
          return;
        }

        alert("????????? ?????? ????????? ??????????????????. ??????????????? ???????????????");
      })

  }

  function displayProgressBar() {
    setProgressBarOpend(true);
  }

  function closeProgressBar() {
    setProgressBarOpend(false);
  }

}
