package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu800;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu800Dao extends JpaRepository<Edu800, Long>, JpaSpecificationExecutor<Edu800> {

    @Transactional
    @Modifying
    @Query(value = "delete from EDU800 e where e.Edu800_ID in ?1 ",nativeQuery = true)
    void deleteByEdu108Ids(List<String> edu108IdList);

    //查询各个学院各项费用之和
    @Query(value = "select new com.beifen.edu.administration.domian.Edu800(sum(e.jsksf), sum(e.wlkczy), sum(e.yyglf), sum(e.cdzlf) , sum(e.jxyxsbf) , sum(e.pyfalzf) , sum(e.sxsbf) , sum(e.cdzlf) ,e.year)  from Edu800 e group by e.year order by e.year")
    List<Edu800> findSumInfo();

    //按年查询各个学院各项费用之和
    @Query(value = "select new com.beifen.edu.administration.domian.Edu800(sum(e.jsksf), sum(e.wlkczy), sum(e.yyglf), sum(e.cdzlf) , sum(e.jxyxsbf) , sum(e.pyfalzf) , sum(e.sxsbf) , sum(e.cdzlf) ,e.year)  from Edu800 e where e.year = ?1 group by e.year order by e.year")
    List<Edu800> findSumInfoByYear(String year);
}
